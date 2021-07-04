import * as db_pool from '../db';
import axios from 'axios';
import config from '../config';
import { storage } from '../index';
import { CronJob } from 'cron';

export class MiningFunctions {

    status: boolean = true;
    shutdown: boolean = false;
    manual: boolean = false;

    workers: any;
    currentStats: any;
    currentExchange: any;

    constructor() {
        new CronJob('0 */5 * * * *', async () => {
            await this.updateMiner();
            await this.uploadMiner();
        }).start();

        new CronJob('*/10 * * * * *', async () => {
            await storage.updateStorage();
            await this.calculateStatus();
        }).start();

        this.updateMiner();
    }

    calculateStatus() {
        if(this.manual)
            return;
        
        if(storage.energy.grid_power > 100) // Mehr als 50 Watt werden vom Netz gekauft
            this.status = false;
        else
        {
            if(storage.energy.grid_power < -200) // Mehr als 200 Watt werden ins Netz eingespeist
                this.status = true;
            else
            {
                if(storage.energy.bat_fuel > 30) // Akku voller als 30%
                    this.status = true;
                else
                {
                    this.status = false;
                    if(new Date().getHours() > 1 && new Date().getHours() < 4) // zwischen 1 und 4 Uhr Nachts
                        this.shutdown = true;
                    else
                        this.shutdown = false;
                }
            }
        }
    }

    async updateMiner() {
        this.workers = await axios.get(`https://api.ethermine.org/miner/${config.eth_address}/dashboard`)
        .then(async (res) => {
            delete(res.data.data.statistics)
            delete(res.data.data.settings)
            delete(res.data.data.currentStatistics)

            return res.data.data.workers;
        });

        this.currentStats = await axios.get(`https://api.ethermine.org/miner/${config.eth_address}/currentStats`)
        .then(async (res) => {
            return res.data.data;
        });

        this.currentExchange = await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=BTC,USD,EUR`)
        .then(async (res) => {
            return res.data;
        });

        try 
        {
            const {InfluxDB} = require('@influxdata/influxdb-client')

            // Ist nur zum Testen. Bin nicht so blöd und lade echte Token hoch XD
            const token = 'l9fOmco7xaStRkCNu-A2tBOoDCCdd0jB8tmKehyRWQhxIfPT3jl1TURlhvBtX-bGY9vpDFNvZ8Ks4uJwldYPkw=='
            const org = 'Schwering'
            const bucket = 'Solar'
    
            const client = new InfluxDB({url: 'http://10.16.2.3:8086', token: token})
    
            const {Point} = require('@influxdata/influxdb-client')
            const writeApi = client.getWriteApi(org, bucket)
            writeApi.useDefaultTags({storage: 'senec1'})
    
            const point = new Point('mining')
            .floatField('currentStats.currentHashrate', this.currentStats.currentHashrate)
            .floatField('currentStats.averageHashrate', this.currentStats.averageHashrate)
            .floatField('currentStats.validShares', this.currentStats.validShares)
            .floatField('currentStats.invalidShares', this.currentStats.invalidShares)
            .floatField('currentStats.staleShares', this.currentStats.staleShares)
            .floatField('currentStats.activeWorkers', this.currentStats.activeWorkers)
            .floatField('currentStats.unpaid', this.currentStats.unpaid)
            .floatField('currentStats.coinsPerMin', this.currentStats.coinsPerMin)
            .floatField('currentExchange.BTC', this.currentExchange.BTC)
            .floatField('currentExchange.USD', this.currentExchange.USD)
            .floatField('currentExchange.EUR', this.currentExchange.EUR)
            .booleanField('miningStatus', this.status)
            .floatField('profit.perkWh', this.calculatekWh())
            .floatField('profit.perDay', this.calculateDay())
            writeApi.writePoint(point)
    
            writeApi
                .close()
                .then(() => {
                    console.log('FINISHED')
                })
                .catch((e: any) => {
                    console.error(e)
                    console.log('\\nFinished ERROR')
                })
        }
        catch(e) {

        }
    }

    async uploadMiner()
    {
        const client = await db_pool.getConnection().connect();
        const db = client.db('solar-miner');
        const col = db.collection('mining');

        await col.insertOne(
            {
                workers: this.workers,
                currentStats: this.currentStats,
                currentExchange: this.currentExchange,
                miningStatus: this.status,
                profit: {
                    perkWh: this.calculatekWh(),
                    perDay: this.calculateDay()
                }
            }
        );

        client.close();
    }

    calculatekWh() {
        return Math.round((1000 / 200) * this.currentStats.coinsPerMin * this.currentExchange.EUR * 60 * 100) / 100;
    }

    calculateDay() {
        return Math.round(24 * 60 * this.currentStats.coinsPerMin * this.currentExchange.EUR * 100) / 100;
    }
}