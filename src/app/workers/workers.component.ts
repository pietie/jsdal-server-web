import { Component } from '@angular/core';
import { L2 } from 'l2-lib/L2';
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr';
import { ApiService } from '~/services/api';


@Component({
  templateUrl: './workers.component.html',
  styles: [`tr.notRunning  { color:red; font-style: italic }`]
})
export class WorkersComponent {
  public workerList: any[];

  public hubConnection: HubConnection;

  constructor(public api: ApiService) {

  }

  ngOnInit() {
    //!this.reloadWorkersList();

    this.hubConnection = new HubConnectionBuilder()
      .configureLogging(LogLevel.Debug)
      .withUrl(this.api.apiBaseUrl + '/worker-hub')
      .build();

    this.hubConnection.start()
      .then(() => {

        this.hubConnection.on("updateWorkerList", changes => {
          this.workerList = changes;
        });

        this.hubConnection.invoke("Init").then(r => {

          // sort by IsRunning, Name
          //this.workerList = r.sort((a, b) => a.isRunning ? -1 : 1).sort((a, b) => { ('' + a.name).localeCompare(b.name) });
          this.workerList = r.sort((a, b) => { ('' + a.name).localeCompare(b.name) });
        });
      });
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

  startWorker(row) {
    L2.postJson(`/api/workers/${row.id}/start`).then((r) => {
      L2.success("Worker started.");
      //!this.reloadWorkersList();
    });
  }

  stopWorker(row) {
    L2.postJson(`/api/workers/${row.id}/stop`).then((r) => {
      L2.success("Worker stopped.");
      //! this.reloadWorkersList();
    });
  }

}
