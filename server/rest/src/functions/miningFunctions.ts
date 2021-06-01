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
                if(storage.energy.bat_fuel > 30) // Akku leerer als 30%
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