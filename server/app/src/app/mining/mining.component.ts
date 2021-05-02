import { Component, OnInit } from '@angular/core';
import { MiningService } from '../services/mining/mining.service';

@Component({
  selector: 'app-mining',
  templateUrl: './mining.component.html',
  styleUrls: ['./mining.component.scss']
})
export class MiningComponent implements OnInit {

  manual: boolean;
  status: boolean;
  shutdown: boolean;

  profit: number;

  constructor(private miningService: MiningService) { }

  ngOnInit(): void {
    this.getManual();
    this.getStatus();
    this.getShutdown();
    this.getProfit();
  }

  getManual() {
    this.miningService.getManual().subscribe((data) => {
      this.manual = data;
    });
  }

  setManual() {
    this.miningService.postManual(!this.manual).subscribe((data) => {
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

  getProfit() {
    this.miningService.getProfit().subscribe((data) => {
      this.profit = data;
    });
  }

}
