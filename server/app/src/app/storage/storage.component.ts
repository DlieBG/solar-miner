import { ElementSchemaRegistry } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { CronJob } from 'cron';
import { MiningService } from '../services/mining/mining.service';
import { StorageService } from '../services/storage/storage.service';
import { Energy, Profit } from './storage.interfaces';

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.scss']
})
export class StorageComponent implements OnInit {

  energy: Energy;

  profit: Profit;

  job: CronJob;

  constructor(private storageService: StorageService, private miningService: MiningService) { }

  ngOnInit(): void {
    this.job = new CronJob('*/10 * * * * *', () => {
      this.refresh();
    });
    this.job.start();

    this.refresh();
  }

  ngOnDestroy(): void {
    this.job.stop();
  }

  refresh() {
    this.getEnergy();
    this.getProfit();
  }

  calculateStatus() {
    let bat = '';
    let grid = '';

    if(this.energy.bat_power < 0)
      bat = 'Entladen';
    if(this.energy.bat_power > 0)
      bat = 'Aufladen';

    if(this.energy.grid_power > 0)
      grid = 'Netzbetrieb';
    if(this.energy.grid_power < 0)
      grid = 'Einspeisung';

    return `${bat} ${grid}`;
  }

  getEnergy() {
    this.storageService.getEnergy().subscribe((data) => {
      this.energy = data;
    });
  }

  getProfit() {
    this.miningService.getProfit().subscribe((data) => {
      this.profit = data;
    });
  }

}
