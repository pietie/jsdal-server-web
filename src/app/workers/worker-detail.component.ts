import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { L2  } from 'l2-lib/L2';

@Component({
    templateUrl: './worker-detail.component.html'
})
export class WorkerDetailComponent {
    public workerName: string;
    public logData:any;
    
    constructor(public activatedRoute: ActivatedRoute) {

        this.activatedRoute.params.subscribe(parms => {

            this.workerName = parms["id"];
            this.onRefresh();
        });
    }

    public onRefresh() {
        L2.fetchJson(`/api/workers/${this.workerName}`).then((r: any) => {
            this.logData = r.Data;
        });
    }

}