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

        const {InfluxDB} = require('@influxdata/influxdb-client')

        // Ist nur zum Testen. Bin nicht so blöd und lade echte Token hoch XD
        const token = 'l9fOmco7xaStRkCNu-A2tBOoDCCdd0jB8tmKehyRWQhxIfPT3jl1TURlhvBtX-bGY9vpDFNvZ8Ks4uJwldYPkw=='
        const org = 'Schwering'
        const bucket = 'Solar'

        const client = new InfluxDB({url: 'http://10.16.2.3:8086', token: token})

        const {Point} = require('@influxdata/influxdb-client')
        const writeApi = client.getWriteApi(org, bucket)
        writeApi.useDefaultTags({storage: 'senec1'})

        const point = new Point('energy')
        .floatField('bat_fuel', this.energy.bat_fuel)
        .floatField('bat_power', this.energy.bat_power)
        .floatField('solar_power', this.energy.solar_power)
        .floatField('house_power', this.energy.house_power)
        .floatField('grid_power', this.energy.grid_power)
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


        const {Client} = require('@elastic/elasticsearch');
        const esclient = new Client({
            node: 'http://10.16.2.3:9200',
        });

        esclient.index({
            index: 'solar-miner',
            body: {
                bat_fuel: this.energy.bat_fuel,
                bat_power: this.energy.bat_power,
                solar_power: this.energy.solar_power,
                house_power: this.energy.house_power,
                grid_power: this.energy.grid_power
            }
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
            let float = new Buffer(input.replace('fl_', ''), 'hex').readFloatBE();
            return  Math.round(float * 1000) / 1000;
        }
    }
}