import { Component } from '@angular/core'
import { L2 } from 'l2-lib/L2';

import { environment } from './../../environments/environment';

@Component({
    templateUrl: 'performance.component.html'
})
export class PerformanceComponent {

    public projectList: any;

    public perfraw: any;


    constructor() {
        this.refresh();
    }

    ngOnInit() {
      
    }

    ngOnDestroy() {
    
    }


    refresh() {

        L2.fetchJson("/api/project").then((json: any) => {
            this.projectList = json.Data;
        });


        L2.fetchJson("/api/performance/tmp-executionlist").then((json: any) => {
            this.perfraw = json.Data;
        });

    }

   

   


}