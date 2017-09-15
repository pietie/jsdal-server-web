import { Component } from '@angular/core';

import { L2 } from 'l2-lib/L2';

@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})
export class HomeComponent {

    public statsData: any = null;
    public isLoadProjectList: boolean = false;
    public projectList: any[] = null;

    public usageDetail:any = null;

    ngOnInit() {
        console.log('home.component :: ngOnInit');
        L2.fetchJson('/api/main/stats').then((r: any) => { this.statsData = r.Data; });

        this.isLoadProjectList = true;
        L2.fetchJson('/api/project').then((r: any) => {
            this.projectList = r.Data;
            this.isLoadProjectList = false;
        }).catch(e => {
            this.isLoadProjectList = false;
        });
    }

    public getWebServerAge(startedDate) {

        var diffInMilliseconds = moment().diff(moment(new Date(startedDate)), "ms");

        // for usage see https://github.com/EvanHahn/HumanizeDuration.js
        return humanizeDuration(diffInMilliseconds, { round: true, units: ["d", "h", "m"] });
    }

    onUsageDetailClick() {

        L2.fetchJson(`/api/main/memdetail`).then((r: any) => {
            this.usageDetail = r.Data;
        });

    }

}
