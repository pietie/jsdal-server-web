import { Component, OnInit } from '@angular/core';
import { ApiService } from '~/services/api';

@Component({
  selector: 'app-health',
  templateUrl: './health.component.html',
  styleUrls: ['./health.component.css']
})
export class HealthComponent implements OnInit {

  constructor(public api: ApiService) { }

  threadStatus;
  latest;

  ngOnInit(): void {

    this.getThreadStatus();
    this.getLatest();
  }

  getThreadStatus() {
    this.api.health.getThreadStatus().then(r => {
      this.threadStatus = r;
    })
  }

  startThread() {
    this.api.health.restartThread().then(r => this.getThreadStatus());
  }

  stopThread() {
    this.api.health.stopThread().then(r => this.getThreadStatus());
  }

  getLatest() {
    this.api.health.getLatest().then(r => this.latest = r);
  }

  refreshChart(filter, chart) {
    //    if (filter.endpoints == null || filter.endpoints.length == 0) return;

    chart.setIsRefreshing(true);

    this.api.health
      .getReport({ ...filter })
      .then(r => {
        console.log("report results-->", r);
        chart.updateResults(r);
        chart.setIsRefreshing(false);
      })
      .catch(e => {
        chart.setIsRefreshing(false);
        console.error(e);
      });
  }

}
