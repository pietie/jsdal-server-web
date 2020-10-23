import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FromToDatetimeDialogComponent } from '../from-to-datetime.dialog/from-to-datetime.dialog.component';
import * as moment from 'moment';
import { ApiService } from '~/services/api';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';


@Component({
  selector: 'l2-chart-card',
  templateUrl: './chart-card.component.html',
  styleUrls: ['./chart-card.component.css']
})
export class ChartCardComponent implements OnInit {

  colorLookup = ["#003049", "#e63946", "#457b9d", "#1d3557", "#ffadad", "#ffd6a5", "#98E086", "#caffbf", "#9bf6ff", "#eae2b7", "#a0c4ff", "#bdb2ff", "#ffc6ff", "#fffffc", "#f77f00", "#fcbf49", "#d62828", "#a8dadc"];


  chartDataSets: ChartDataSets[] = [
    {
      data: [], label: '', backgroundColor: ["#003049", "#d62828", "#f77f00", "#fcbf49", "#eae2b7", "#e63946", "#a8dadc", "#457b9d", "#1d3557",
        "#ffadad", "#ffd6a5", "#fdffb6", "#caffbf", "#9bf6ff", "#a0c4ff", "#bdb2ff", "#ffc6ff", "#fffffc"],
      borderColor: '#fff',
      borderWidth: 2,
      hoverBackgroundColor: 'rgba(30,30,240,0.3)'
    }
  ];

  chartLabels: string[] = [];

  chartOptions: ChartOptions = {
    onClick: (a, b) => { console.log(a, b); },
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    legend: { align: "center", fullWidth: true, position: "right", display: true },
    plugins: {
      datalabels: {
        display: false,
        anchor: 'end',
        align: 'end',
      }
    }
  };


  @Input() title: string;
  @Input() width: string = 'auto';
  @Input('type') chartType: ChartType = 'bar';
  @Input('legend') chartLegend = true;
  @Input() allowMaxRowsSelection: boolean = true;
  @Input() allowEndpointSelection: boolean = true;
  @Input() allowMultipleEndpoints: boolean = false;

  _datasetLabel: string;
  get datasetLabel(): string {
    return this._datasetLabel;
  }
  @Input() set datasetLabel(value: string) {
    this._datasetLabel = value;
    this.callRefresh();
    if (this.chartDataSets && this.chartDataSets.length > 0) {
      this.chartDataSets[0].label = value;
    }
  }

  chartPlugins = [pluginDataLabels];



  @Output() refresh: EventEmitter<filterType> = new EventEmitter();

  filter: filterType = { topN: 10 };

  endpoints: string[];

  isRefreshing: boolean = false;

  constructor(public dialog: MatDialog, public api: ApiService) { }

  ngOnInit(): void {
    this.setDateFilterType("Last hour");

    this.api.dataCollector.getAllEndpoints().then(r => {
      this.endpoints = r;
    });
  }

  predefinedItemSelected(sender: HTMLButtonElement) {
    this.setDateFilterType(sender.textContent);
  }

  setDateFilterType(type: string) {
    this.filter.selectedDateType = type;

    if (type == "Last hour") {
      this.filter.from = moment().add(-1, 'hour');
      this.filter.to = moment();
      this.filter.selectedDateDesc = `${this.filter.from.format("HH:mm")} - ${this.filter.to.format("HH:mm")}`;
    }
    else if (type == "Last 3 hours") {
      this.filter.from = moment().add(-3, 'hour');
      this.filter.to = moment();
      this.filter.selectedDateDesc = `${this.filter.from.format("HH:mm")} - ${this.filter.to.format("HH:mm")}`;
    }
    else if (type == "Today") {
      this.filter.from = moment().startOf('day');
      this.filter.to = this.filter.from.clone().endOf('day');
      this.filter.selectedDateDesc = `${this.filter.from.format("DD MMM")}`
    }
    else if (type == "Yesterday") {
      this.filter.from = moment().add(-1, 'day').startOf('day');
      this.filter.to = this.filter.from.clone().endOf('day');
      this.filter.selectedDateDesc = `${this.filter.from.format("DD MMM")}`
    }
    else if (type == "Last 3 days") {
      this.filter.from = moment().add(-3, 'day').startOf('day');
      this.filter.to = moment().endOf('day');
      this.filter.selectedDateDesc = `${this.filter.from.format("DD MMM")} - ${this.filter.to.format("DD MMM")}`
    }
    else if (type == "Last week") {
      this.filter.from = moment().add(-7, 'day').startOf('day');
      this.filter.to = moment().endOf('day');
      this.filter.selectedDateDesc = `${this.filter.from.format("DD MMM")} - ${this.filter.to.format("DD MMM")}`
    }
    else {
      throw `Unsupported selected date type: ${type}`;
    }

    this.callRefresh();
  }

  customClicked() {
    let ref = this.dialog.open(FromToDatetimeDialogComponent, { disableClose: true });

    let sub$ = ref.afterClosed().subscribe(ret => {
      sub$.unsubscribe();
      if (ret) {
        this.filter.selectedDateType = "Custom";
        this.filter.selectedDateDesc = `${this.filter.from.format("DD MMM yyyy, HH:mm")} - ${this.filter.to.format("DD MMM yyyy, HH:mm")}`
        this.filter.from = ret.from;
        this.filter.to = ret.to;

        this.callRefresh();
      }
    })
  }



  setIsRefreshing(b: boolean) {
    this.isRefreshing = b;
  }

  updateResults(r: { labels: string[], datasets: any[] }) {
    this.chartLabels = r.labels;

    let colorIx = 0;

    // assign colors to dataset
    for (var e in r.datasets) {
      r.datasets[e].borderColor = r.datasets[e].borderColor = r.datasets[e].backgroundColor = this.colorLookup[(++colorIx) % this.colorLookup.length];
      r.datasets[e].pointBackgroundColor = r.datasets[e].borderColor;
      r.datasets[e].fill = false;
      r.datasets[e].lineTension = 0; // 0.3
    }

    this.chartDataSets = r.datasets;
  }

  callRefresh() {

    //  this.isRefreshing = true;

    if (this.refresh != null) {
      this.refresh.emit(this.filter);
    }

  }

  quickSelect(filter: 'PROD' | 'DEV') {
    this.filter.endpoints = this.endpoints.filter(ep => ep.toUpperCase().endsWith(filter));
    this.callRefresh();
  }

}

declare type filterType = {
  from?: Date | moment.Moment | any,
  to?: Date | moment.Moment | any,
  selectedDateType?: string,
  selectedDateDesc?: string,
  endpoints?: string | string[],
  topN: number
};
