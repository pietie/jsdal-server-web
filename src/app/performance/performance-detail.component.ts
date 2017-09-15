import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { L2  } from 'l2-lib/L2';

@Component({
    templateUrl: 'performance-detail.component.html'
})
export class PerformanceDetailComponent {

    public projectName: string;
    public dbSourceName: string;
    

    constructor(public activatedRoute: ActivatedRoute) {

        this.activatedRoute.params.subscribe(params => {

            this.dbSourceName = params["dbSource"];

            alert(this.dbSourceName);

            //this.refreshDbList();
        });

    }



}