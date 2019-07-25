import { Component } from '@angular/core';
import { L2 } from 'l2-lib/L2';
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr';
import { environment } from './../../environments/environment';

import { Observable, Subscription } from 'rxjs';

@Component({
    templateUrl: './workers.component.html'
})
export class WorkersComponent {
    public workerList: any[];

    public hubConnection: HubConnection;

    ngOnInit() {
        //!this.reloadWorkersList();

        this.hubConnection = new HubConnectionBuilder()
            .configureLogging(LogLevel.Debug)
            .withUrl(environment.apiBaseUrl + '/worker-hub')
            .build();

        this.hubConnection.start()
            .then(() => {

                this.hubConnection.on("updateWorkerList", changes => {
                    this.workerList = changes;
                });

                this.hubConnection.invoke("Init").then(r => {
                    this.workerList = r;
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