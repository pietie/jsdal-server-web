import { Component, OnInit, Input } from '@angular/core';
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
    responsive: true,
    scales: { xAxes: [{}], yAxes: [{}] },
    legend: { align: "center", fullWidth: true, position: "right", display: true },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };

  @Input('type') chartType: ChartType = 'bar';
  @Input('legend') chartLegend = true;
  @Input() allowMaxRowsSelection: boolean = true;

  _datasetLabel: string;
  get datasetLabel(): string {
    return this._datasetLabel;
  }
  @Input() set datasetLabel(value: string) {
    this._datasetLabel = value;

    if (this.chartDataSets && this.chartDataSets.length > 0) {
      this.chartDataSets[0].label = value;
    }
  }

  _resourceType: number = 1;
  get resourceType(): number {
    return this._resourceType;
  }
  @Input() set resourceType(value: number) {
    if (this._resourceType != value) {
      this._resourceType = value;
      this.refresh();
    }

  }

  chartPlugins = [pluginDataLabels];


  @Input() allowMultipleEndpoints: boolean = false;


  filter: {
    from?: Date | moment.Moment | any,
    to?: Date | moment.Moment | any,
    selectedDateType?: string,
    selectedDateDesc?: string,
    endpoints?: string | string[],
    topN: number
  } = { topN: 10 };

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

    this.refresh();
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

        this.refresh();
      }
    })
  }

  refresh() {
    this.isRefreshing = true;
    // TODO: Raise event. Data needs to be loaded and provided form outside of this control?
    this.api.dataCollector
      .topN({
        topN: this.filter.topN,
        fromDate: this.filter.from,
        toDate: this.filter.to,
        endpoints: this.filter.endpoints,
        type: this._resourceType

      })
      .then(r => {
        this.isRefreshing = false;
        console.log("refresh-->", r);
        if (this._resourceType == 500)
        {
          this.chartLabels = r.labels;
          this.chartDataSets = r.datasets;
          return;
        }

        this.chartDataSets[0].data = r.data;
        this.chartLabels = r.labels;
        //this.chartData = r;

      })
      .catch(e => {
        this.isRefreshing = false;
        console.error(e);
      });

  }

}
