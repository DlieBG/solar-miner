import * as db_pool from '../db';
import axios from "axios";
import config from "../config";
import { CronJob } from 'cron';

export class StorageFunctions {

    energy: any;

    constructor() {
        new CronJob('0 */5 * * * *', async () => {
            await this.updateStorage();
            await this.uploadStorage();
        }).start();

        this.updateStorage();
    }

    async updateStorage() {
        this.energy = await axios.post(`http://${config.senec_address}/dashboard`, { "ENERGY": 
            {
                "GUI_BAT_DATA_FUEL_CHARGE": "",
                "GUI_BAT_DATA_POWER": "",
                "GUI_INVERTER_POWER": "",
                "GUI_HOUSE_POW": "",
                "GUI_GRID_POW": ""
            }
        } )
        .then(async (res) => {
            return {
                bat_fuel: this.decode(res.data.ENERGY.GUI_BAT_DATA_FUEL_CHARGE),
                bat_power: this.decode(res.data.ENERGY.GUI_BAT_DATA_POWER),
                solar_power: this.decode(res.data.ENERGY.GUI_INVERTER_POWER),
                house_power: this.decode(res.data.ENERGY.GUI_HOUSE_POW),
                grid_power: this.decode(res.data.ENERGY.GUI_GRID_POW)
            };
        });
    }

    async uploadStorage() {
        const client = await db_pool.getConnection().connect();
        const db = client.db('solar-miner');
        const col = db.collection('solar');

        await col.insertOne(
            this.energy
        );

        client.close();
    }

    decode(input: string) {
        if(input.startsWith('fl_'))
        {
            return new Buffer(input.replace('fl_', ''), 'hex').readFloatBE();
        }
    }
}