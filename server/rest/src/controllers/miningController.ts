import { Request, Response } from 'express';
import { mining } from '..';
import config from '../config';

export class MiningController {

    // public async getTest(req: Request, res: Response): Promise<void> {
    //     const client = await db.getConnection().connect();
    //     const f_db = client.db('birds');
    //     const col = f_db.collection('species');
        
    //     res.json({
    //         species: await col.find({}).toArray()
    //     });

    //     client.close();
    // }

    public async getAddress(req: Request, res: Response): Promise<void> {
        res.json(config.eth_address);
    }

    public async getStatus(req: Request, res: Response): Promise<void> {
        res.send(mining.status);
    }

    public async postStatus(req: Request, res: Response): Promise<void> {
        mining.status = req.body.status;
        res.send(mining.status);
    }

    public async getShutdown(req: Request, res: Response): Promise<void> {
        res.send(mining.shutdown);
    }

    public async postShutdown(req: Request, res: Response): Promise<void> {
        mining.shutdown = req.body.shutdown;
        res.send(mining.shutdown);

        setTimeout(() => {
            mining.shutdown = false;
        }, 60000);
    }

    public async getManual(req: Request, res: Response): Promise<void> {
        res.send(mining.manual);
    }

    public async postManual(req: Request, res: Response): Promise<void> {
        mining.manual = req.body.manual;
        res.send(mining.manual);
    }

    public async getProfit(req: Request, res: Response): Promise<void> {
        res.send({
            perkWh: mining.calculatekWh().toString(),
            perDay: mining.calculateDay().toString()
        });
    }

    public async getCurrent(req: Request, res: Response): Promise<void> {
        res.json({
            workers: mining.workers,
            currentStats: mining.currentStats,
            currentExchange: mining.currentExchange
        });
    }
}