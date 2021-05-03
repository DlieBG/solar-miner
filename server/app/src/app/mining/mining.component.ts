import { Component, OnInit } from '@angular/core';
import { CronJob } from 'cron';
import { MiningService } from '../services/mining/mining.service';
import { Current, Profit } from './mining.interface';

@Component({
  selector: 'app-mining',
  templateUrl: './mining.component.html',
  styleUrls: ['./mining.component.scss']
})
export class MiningComponent implements OnInit {

  manual: boolean;
  status: boolean;
  shutdown: boolean;
  address: string;

  profit: Profit;

  current: Current;

  job: CronJob;

  constructor(private miningService: MiningService) { }

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
    this.getManual();
    this.getStatus();
    this.getShutdown();
    this.getAddress();
    this.getProfit();
    this.getCurrent();
  }

  getWorkerString() {
    let h = '';

    this.current.workers.forEach(worker => {
      h += worker.worker + ',';
    });

    return h.slice(0, -1);
  }

  getManual() {
    this.miningService.getManual().subscribe((data) => {
      this.manual = data;
    });
  }

  setManual() {
    this.miningService.postManual(this.manual).subscribe((data) => {
      this.manual = data;
    });
  }

  getStatus() {
    this.miningService.getStatus().subscribe((data) => {
      this.status = data;
    });
  }

  setStatus() {
    this.miningService.postStatus(!this.status).subscribe((data) => {
      this.status = data;
    });
  }

  getShutdown() {
    this.miningService.getShutdown().subscribe((data) => {
      this.shutdown = data;
    });
  }

  setShutdown() {
    this.miningService.postShutdown(!this.shutdown).subscribe((data) => {
      this.shutdown = data;
    });
  }

  getAddress() {
    this.miningService.getAddress().subscribe((data) => {
      this.address = data;
    });
  }

  getProfit() {
    this.miningService.getProfit().subscribe((data) => {
      this.profit = data;
    });
  }

  getCurrent() {
    this.miningService.getCurrent().subscribe((data) => {
      this.current = data;
    });
  }

}
