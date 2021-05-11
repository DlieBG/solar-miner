import { Router } from 'express';
import { StorageController } from '../controllers/storageController';

export class StorageRoutes {

    public router: Router;
    public storageController: StorageController = new StorageController();

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes():void {
        this.router.get("/energy", this.storageController.getEnergy);
    }
}
