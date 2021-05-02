import { Router } from 'express';
import { MiningController } from '../controllers/miningController';

export class MiningRoutes {

    public router: Router;
    public miningController: MiningController = new MiningController();

    constructor() {
        this.router = Router();
        this.routes();
    }

    routes():void {
        this.router.get("/address", this.miningController.getAddress);
        this.router.get("/status", this.miningController.getStatus);
        this.router.post("/status", this.miningController.postStatus);
        this.router.get("/shutdown", this.miningController.getShutdown);
        this.router.post("/shutdown", this.miningController.postShutdown);
        this.router.get("/manual", this.miningController.getManual);
        this.router.post("/manual", this.miningController.postManual);
        this.router.get("/profit", this.miningController.getProfit);
    }
}
