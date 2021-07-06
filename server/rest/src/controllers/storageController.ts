import { Request, Response } from 'express';
import { storage } from '..';
import config from '../config';
var FCM = require('fcm-node');

export class StorageController {

    public async getEnergy(req: Request, res: Response): Promise<void> {
        res.json(storage.energy);
    }

    public async postAlert(req: Request, res: Response): Promise<void> {        
        var fcm = new FCM(config.serverKey);
        var message = { 
            to: 'dSvcsDop4ek:APA91bFcfxJak8NLbyxjpXavu3RLbf28jNLRRcAcTTN7_dzg-MS8rzN3uRsPvMgpmPNvpJCaRIFMOliUDX169uf3cH2V7isYYMa0F6Hn5VZRunVhz_ZJBUot5m9V2HotGtbBxtAULUvM', 
            notification: {
                title: req.body._check_name, 
                body: req.body._message
            }
        };

        await fcm.send(message, () => {
            res.sendStatus(200);
        });
    }
}