import { Component } from '@angular/core';
import { L2  } from 'l2-lib/L2';
import { HubConnection } from '@aspnet/signalr-client';

@Component({
    templateUrl: './workers.component.html'
})
export class WorkersComponent {
    public workerList: any[];

    ngOnInit() {
        //!this.reloadWorkersList();

        let connection = new HubConnection('http://localhost:9086/worker-hub'); // TODO: sort out url
        
        // TODO: Disconnect when component is not active
                    connection.start()
                        .then(() => {
                            connection.stream("StreamWorkerDetail").subscribe(<any>{
                                next: (n => { this.workerList = n; }),
                                error: function (err) {
                                    console.info("Streaming error");
                                    console.error(err); 
                                }
                            });
        
                        });
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