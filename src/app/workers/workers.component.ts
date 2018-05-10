import { Component } from '@angular/core';
import { L2 } from 'l2-lib/L2';
import { HubConnection } from '@aspnet/signalr-client';
import { environment } from './../../environments/environment';

import { Observable ,  Subscription } from 'rxjs';

@Component({
    templateUrl: './workers.component.html'
})
export class WorkersComponent {
    public workerList: any[];

    public hubConnection: HubConnection;
    private stream$:Observable<any>;
    private streamSubscription:Subscription;

    ngOnInit() {
        //!this.reloadWorkersList();

        this.hubConnection = new HubConnection(environment.apiBaseUrl + '/worker-hub'); // TODO: sort out url

        // TODO: Disconnect when component is not active
        this.hubConnection.start()
            .then(() => {

                this.hubConnection.invoke("Init").then(r => {
                    this.workerList = r;
                });

                this.stream$ = <any>this.hubConnection.stream("StreamWorkerDetail");
                
                this.streamSubscription = this.stream$.subscribe(<any>{
                    next: (n => { this.workerList = n; }),
                    error: function (err) {
                        console.info("Streaming error");
                        console.error(err);
                    }
                });

            });
    }

    ngOnDestroy() {
        try {
            if (this.hubConnection)
            {
                if (this.streamSubscription)
                {
                    this.streamSubscription.closed = true;
                    this.streamSubscription.unsubscribe();
                    this.streamSubscription = null;
                }
                this.hubConnection.stop();
                this.hubConnection = null;
            }
        }
        catch (e) {
            console.warn(e);
        }
    }

    private reloadWorkersList() {
        L2.fetchJson(`/api/workers`).then((r: any) => {
            this.workerList = r.Data;
        });
    }

    startWorker(row) {
        L2.postJson(`/api/workers/${row.id}/start`).then((r) => {
            L2.success("Worker started.");
            this.reloadWorkersList();
        });
    }

    stopWorker(row) {
        L2.postJson(`/api/workers/${row.id}/stop`).then((r) => {
            L2.success("Worker stopped.");
            this.reloadWorkersList();
        });
    }

}