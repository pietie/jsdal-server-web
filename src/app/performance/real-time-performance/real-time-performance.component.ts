import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { HubConnectionBuilder, HubConnection, LogLevel, IStreamResult, ISubscription } from '@aspnet/signalr';
import { Observable, Subscription } from 'rxjs';
import { environment } from './../../../environments/environment';
import { L2 } from 'l2-lib/L2';
import { AccountService } from '~/account/account.service';

@Component({
  selector: 'app-real-time-performance',
  templateUrl: './real-time-performance.component.html',
  styleUrls: ['./real-time-performance.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RealTimePerformanceComponent implements OnInit {

  public hubConnection: HubConnection;

  public realtimeExectuionData: any;

  signalRStatus: string = "UNKNOWN";


  constructor(public account: AccountService, public cdr: ChangeDetectorRef) {

  }

  ngOnInit() {
    try {
      this.hubConnection = new HubConnectionBuilder()
        .configureLogging(LogLevel.Debug)
        .withUrl(environment.apiBaseUrl + '/performance-realtime-hub')
        .build();

      // TODO: Move ALL Hub interactions to shared service!

      this.hubConnection
        .start()
        .then(() => {

          this.signalRStatus = "CONNECTED";

          this.hubConnection.on("update", data => {
            this.realtimeExectuionData = data;
          });

          this.hubConnection.invoke("Init").then(r => {
            this.realtimeExectuionData = r;
          });

          this.cdr.markForCheck();

        })
        .catch(e => {
          this.signalRStatus = e.toString();
          console.error("failed to start", e);
        });

      this.updateRealtimeRunningTimes();
    }
    catch (e) {
      L2.handleException(e);
    }
  }

  ngOnDestroy(): void {
    try {
      if (this.hubConnection) {

        this.hubConnection.stop().then(() => { console.info("then...."); }).catch(e => { console.error("failed to stop hubConnection!!! ", e); });
        this.hubConnection = null;
      }
    }
    catch (e) {
      console.warn(e);
    }

  }

  updateRealtimeRunningTimes() {
    this.cdr.markForCheck();
    setTimeout(() => this.updateRealtimeRunningTimes(), 50);
  }

  getRunningTime(row) {
    if (!row) return null;

    let createdMom = moment(row.ce);
    let endMom = moment();

    if (row.ee/*EndEpoch*/) {
      endMom = moment(row.ee);
    }

    let diff = endMom.diff(createdMom, 'ms');

    if (diff < 0) diff = 0;

    return this.formatMilliseconds(diff);
  }

  formatMilliseconds(ms: number) {
    if (ms == null) return null;
    if (ms == 0) return "0s";

    //if (ms < 1000) return `${ms}ms`;

    var s = (ms / 1000.0).toFixed(2);

    return s + "s";
  }

  getStatus(row: any): string {
    if (row == null) return "UNKOWN";
    else if (row.ex) return "ERROR";
    else if (row.ee) {
      return "COMPLETED";
    }
    else {
      return "RUNNING";
    }

  }


}
