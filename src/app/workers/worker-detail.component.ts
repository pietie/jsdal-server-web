import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { L2  } from 'l2-lib/L2';

@Component({
    templateUrl: './worker-detail.component.html'
})
export class WorkerDetailComponent {
    public id: string;
    public logData:any;
    
    constructor(public activatedRoute: ActivatedRoute, public router: Router) {

        this.activatedRoute.params.subscribe(parms => {

            this.id = parms["id"];
            this.onRefresh();
        });
    }

    public onRefresh() {
        L2.fetchJson(`/api/workers/${this.id}`).then((r: any) => {
            this.logData = r.Data;
        });
    }

}