import { Component } from '@angular/core';

import { L2 } from 'l2-lib/L2';


import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr';
import { ApiService } from '~/services/api';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { UptimeHistoryDialogComponent } from './uptime-history-dialog/uptime-history-dialog.component';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  public statsData: any = null;
  public isLoadProjectList: boolean = false;
  public projectList: any[] = null;

  public usageDetail: any = null;

  public hubConnection: HubConnection;

  public clrCounters: any;

  public sysPerfWaiting: boolean = false;

  knownCounters: { [key: string]: { [key: string]: { Description: string } } } = {
    "System.Runtime": {

      "cpu-usage": { Description: "Amount of time the process has utilized the CPU (ms)" },
      "working-set": { Description: "Amount of working set used by the process (MB)" },
      "gc-heap-size": { Description: "Total heap size reported by the GC (MB)" },
      "gen-0-gc-count": { Description: "Number of Gen 0 GCs / min" },
      "gen-1-gc-count": { Description: "Number of Gen 1 GCs / min" },
      "gen-2-gc-count": { Description: "Number of Gen 2 GCs / min" },
      "time-in-gc": { Description: "% time in GC since the last GC" },
      "gen-0-size": { Description: "Gen 0 Heap Size" },
      "gen-1-size": { Description: "Gen 1 Heap Size" },
      "gen-2-size": { Description: "Gen 2 Heap Size" },
      "loh-size": { Description: "LOH Heap Size" },
      "alloc-rate": { Description: "Allocation Rate" },
      "assembly-count": { Description: "Number of Assemblies Loaded" },
      "exception-count": { Description: "Number of Exceptions / sec" },
      "threadpool-thread-count": { Description: "Number of ThreadPool Threads" },
      "monitor-lock-contention-count": { Description: "Monitor Lock Contention Count" },
      "threadpool-queue-length": { Description: "ThreadPool Work Items Queue Length" },
      "threadpool-completed-items-count": { Description: "ThreadPool Completed Work Items Count" },
      "active-timer-count": { Description: "Active Timers Count" },
    },

    "Microsoft.AspNetCore.Hosting": {
      "requests-per-second": { Description: "Request rate per second" },
      "total-requests": { Description: "Total number of requests" },
      "current-requests": { Description: "Current number of requests" },
      "failed-requests": { Description: "Failed number of requests" }
    }

  };

  constructor(public api: ApiService, public dialog: MatDialog) {

  }

  ngOnInit() {
    try {
      this.hubConnection = new HubConnectionBuilder()
        .configureLogging(LogLevel.Debug)
        .withUrl(this.api.apiBaseUrl + '/main-stats')
        .build();

      this.hubConnection
        .start()
        .then(() => {
          this.hubConnection.on("updateStats", stats => {
            this.statsData = stats;
          });

          this.hubConnection.invoke("Init").then(r => {
            this.statsData = r;
          });

          // this.hubConnection
          //     .invoke("SubscribeToDotnetCorePerfCounters")
          //     .then(() => {
          //         this.sysPerfWaiting = false;
          //     });

          this.hubConnection.on("clrCounterUpdate", data => {
            this.clrCounters = data;
          });
        });

      this.isLoadProjectList = true;

      L2.fetchJson('/api/project').then((r: any) => {
        this.projectList = r.Data;
        this.isLoadProjectList = false;
      }).catch(e => {
        console.info("!!!", e);
        this.isLoadProjectList = false;
      });
    }
    catch (e) {
      L2.handleException(e);
    }
  }

  ngOnDestroy() {
    try {
      if (this.hubConnection) {
        this.hubConnection.stop();
        this.hubConnection = null;
      }
    }
    catch (e) {
      console.warn(e);
    }
  }

  public getWebServerAge(startedDate) {

    var diffInMilliseconds = moment().diff(moment(new Date(startedDate)), "ms");

    // for usage see https://github.com/EvanHahn/HumanizeDuration.js
    return humanizeDuration(diffInMilliseconds, { round: true, units: ["d", "h", "m"] });
  }

  isGCollecting: boolean = false;
  gcCollect() {
    this.isGCollecting = true;

    this.hubConnection.invoke("ForceGCCollect").then((r: number) => {
      L2.success(`GC collected in ${r}ms`);
      this.isGCollecting = false;
    }).catch(e => {
      this.isGCollecting = false;
      L2.handleException(e);
    });


  }

  onUsageDetailClick() {

    L2.fetchJson(`/api/main/memdetail`).then((r: any) => {
      this.usageDetail = r.Data;
    });

  }

  onEnableSystemPerformanceChanged(slider) {
    let isEnabled: boolean = !slider.checked;

    this.sysPerfWaiting = true;

    if (isEnabled) {
      this.hubConnection
        .invoke("SubscribeToDotnetCorePerfCounters")
        .then((initialState) => {
          this.clrCounters = initialState;
          this.sysPerfWaiting = false;
        }).catch(() => {
          this.sysPerfWaiting = false;
        });
    }
    else {
      this.clrCounters = null;
      this.hubConnection
        .invoke("UnsubscribeFromDotnetCorePerfCounters")
        .then(() => {
          this.sysPerfWaiting = false;
        }).catch(() => {
          this.sysPerfWaiting = false;
        });
    }
  }

  showUptimeHistory() {
    try {

      this.dialog.open(UptimeHistoryDialogComponent, { disableClose: true, width: "500px", minHeight: "300px" });

    } catch (e) {
      L2.handleException(e);
    }
  }

}
