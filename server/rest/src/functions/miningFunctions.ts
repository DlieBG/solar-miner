import * as db_pool from '../db';
import axios from 'axios';
import config from '../config';
import { CronJob } from 'cron';

export class MiningFunctions {

    status: boolean = true;
    shutdown: boolean = false;
    manual: boolean = false;

    workers: any;
    currentStats: any;
    currentExchange: any;

    constructor() {
        new CronJob('0 */5 * * * *', () => {
            this.updateMiner();
        }).start();

        this.updateMiner();
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