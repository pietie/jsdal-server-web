import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import * as L2 from '../L2'

@Component({
    templateUrl: 'performance-detail.component.html'
})
export class PerformanceDetailComponent {

    private projectName: string;
    private dbSourceName: string;
    

    constructor(private activatedRoute: ActivatedRoute) {

        this.activatedRoute.params.subscribe(params => {

            this.dbSourceName = params["dbSource"];

            alert(this.dbSourceName);

            //this.refreshDbList();
        });

    }



}