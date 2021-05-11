import { Request, Response } from 'express';
import { storage } from '..';
import config from '../config';

export class StorageController {

    public async getEnergy(req: Request, res: Response): Promise<void> {
        res.json(storage.energy);
    }
}