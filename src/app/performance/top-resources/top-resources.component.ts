import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { L2 } from 'l2-lib/L2';
import { MsgDialog } from '~/dialogs';
import { ApiService } from '~/services/api';

@Component({
  selector: 'app-top-resources',
  templateUrl: './top-resources.component.html',
  styleUrls: ['./top-resources.component.css']
})
export class TopResourcesComponent implements OnInit {

  constructor(public api: ApiService, public dialog: MatDialog) { }

  sort;
  @ViewChild(MatSort) set content(content: ElementRef) {
    this.sort = content;
    // if (this.sort) {
    //   this.topNAllListData.sort = this.sort;

    // }
  }

  topN: { resourceType: number } = { resourceType: 1 };
  specificRoutine: { schema?: string, routine?: string } = {};

  ngOnInit() {



  }

  getButtonText(buttonId: string) {
    return document.getElementById(buttonId).textContent;
  }

  refreshTopN(filter, chart) {
    if (filter.endpoints == null || filter.endpoints.length == 0) return;

    chart.setIsRefreshing(true);

    this.api.dataCollector
      .topN({ ...filter, ...{ type: this.topN.resourceType } })
      .then(r => {

        chart.updateResults({ labels: r.labels, datasets: [{ data: r.data }] });
        chart.setIsRefreshing(false);

        console.log("refresh-->", r);

        //this.chartDataSets[0].data = r.data;
        //this.chartLabels = r.labels;



      })
      .catch(e => {
        chart.setIsRefreshing(false);
        console.error(e);
      });
  }

  refreshServerPerformance(filter, chart) {
    if (filter.endpoints == null || filter.endpoints.length == 0) return;

    chart.setIsRefreshing(true);

    // TODO: CHange from topN to more dedicated call?
    this.api.dataCollector
      .topN({ ...filter, ...{ type: 500 } })
      .then(r => {

        console.log("refresh-->", r);
        chart.updateResults(r);
        chart.setIsRefreshing(false);
      })
      .catch(e => {
        chart.setIsRefreshing(false);
        console.error(e);
      });
  }

  refreshRoutineSpecific(filter, chart) {
    if (this.specificRoutine == null || this.specificRoutine.schema == null || this.specificRoutine.routine == null || filter.endpoints == null || filter.endpoints.length == 0) return;

    chart.setIsRefreshing(true);

    this.api.dataCollector.routineTotals({ ...{ schema: this.specificRoutine?.schema, routine: this.specificRoutine?.routine }, ...filter })
      .then(r => {

        chart.updateResults(r);
        chart.setIsRefreshing(false);

      }).catch(e => {
        console.error(e);
        chart.setIsRefreshing(false);
      });


  }


  topNAllListData: MatTableDataSource<any> = null;
  displayedColumns: string[] = ['Routine', 'TotalExecutions', 'TotalDurationInMins', 'TotalMBReceived', 'AvgDurationInMS', 'AvgKBReceived', 'AvgSumNetworkServerTimeInMS', 'TotalExceptions', 'TotalNetworkServerTimeInMins', 'TotalTimeouts'];
  refreshAllStatsList(filter, chart) {
    if (filter.endpoints == null || filter.endpoints.length == 0) return;

    chart.setIsRefreshing(true);

    this.api.dataCollector
      .topNAllStatsList(filter)
      .then(r => {

        //chart.updateResults({ labels: r.labels, datasets: [{ data: r.data }] });
        chart.setIsRefreshing(false);

        console.log(r);

        this.topNAllListData = new MatTableDataSource(r);
        this.topNAllListData.sort = this.sort;


      })
      .catch(e => {
        chart.setIsRefreshing(false);
        console.error(e);
      });
  }

  aggStats;
  fetchAggStats() {
    this.api.dataCollector.fetchStats().then(r => this.aggStats = r)
  }


  isPurging: boolean = false;
  purge(daysOld: number) {
    MsgDialog.confirm(this.dialog, "Confirm action", "Are you sure you wish to purge the aggregate history?").then(b => {

      if (!b) return;

      this.isPurging = true;

      this.api.dataCollector.purge({ daysOld: daysOld })
        .then((cnt) => {
          this.isPurging = false;
          L2.success(`History purged ${cnt} record(s)`);
          this.fetchAggStats();

        }).catch(e => {
          this.isPurging = false;
          L2.handleException(e);
        });

    });


  }

}
