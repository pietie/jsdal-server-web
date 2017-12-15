import { Component } from '@angular/core';

import { L2 } from 'l2-lib/L2';

import { HubConnection } from '@aspnet/signalr-client';

@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})
export class HomeComponent {

    public statsData: any = null;
    public isLoadProjectList: boolean = false;
    public projectList: any[] = null;

    public usageDetail: any = null;

    ngOnInit() {
        try {
            //!L2.fetchJson('/api/main/stats').then((r: any) => { this.statsData = r.Data; });
            let connection = new HubConnection('http://localhost:9086/main-stats'); // TODO: sort out url

// TODO: Disconnect when component is not active
            connection.start()
                .then(() => {

                    connection.invoke("Init").then(r => {
                        this.statsData = r;
                    });

                    connection.stream("StreamMainStats").subscribe(<any>{
                        next: (n => { this.statsData = n; }),
                        error: function (err) {
                            console.info("Streaming error");
                            console.error(err); 
                        }
                    });

                }); 


            this.isLoadProjectList = true;
            L2.fetchJson('/api/project').then((r: any) => {
                this.projectList = r.Data;
                this.isLoadProjectList = false;
            }).catch(e => {
                this.isLoadProjectList = false;
            });
        }
        catch (e) {
            L2.handleException(e);
        }
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
