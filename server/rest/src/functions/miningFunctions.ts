import * as db_pool from '../db';
import axios from 'axios';
import config from '../config';
import { CronJob } from 'cron';

export class MiningFunctions {

    status: boolean = true;
    shutdown: boolean = false;
    manual: boolean = false;

    dashboard: any;
    currentStats: any;

    constructor() {
        new CronJob('0 */5 * * * *', () => {
            this.updateMiner();
        }).start();

        this.updateMiner();
    }

    async updateMiner() {
        this.dashboard = await axios.get(`https://api.ethermine.org/miner/${config.eth_address}/dashboard`)
        .then(async (res) => {
            delete(res.data.data.statistics)
            delete(res.data.data.settings)

            return res.data.data;
        });

        this.currentStats = await axios.get(`https://api.ethermine.org/miner/${config.eth_address}/currentStats`)
        .then(async (res) => {
            return res.data.data;
        });

        const client = await db_pool.getConnection().connect();
        const db = client.db('solar-miner');
        const col = db.collection('mining');

        await col.insertOne(
            {
                dashboard: this.dashboard,
                currentStats: this.currentStats
            }
        );

        client.close();
    }

    calculateProfit() {
        return (1000 / 200) * this.currentStats.usdPerMin * 60;
    }
}