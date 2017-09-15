import { Component } from '@angular/core';
import { L2  } from 'l2-lib/L2';

@Component({
    templateUrl: './workers.component.html'
})
export class WorkersComponent {
    public workerList: any[];

    ngOnInit() {
        this.reloadWorkersList();
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