import { Component } from '@angular/core'
import { L2  } from 'l2-lib/L2';

@Component({
    templateUrl: 'performance.component.html'
})
export class PerformanceComponent {

    public projectList: any;

    constructor() {
        this.refresh();
    }

    refresh() {

        L2.fetchJson("/api/project").then((json: any) => {
            this.projectList = json.Data;
        });

    }


}