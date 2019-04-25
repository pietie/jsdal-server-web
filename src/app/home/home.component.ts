import { Component } from '@angular/core';

import { L2 } from 'l2-lib/L2';

import { environment } from '../../environments/environment';
import { HubConnectionBuilder, HubConnection, LogLevel } from '@aspnet/signalr';
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})
export class HomeComponent {

    public statsData: any = null;
    public isLoadProjectList: boolean = false;
    public projectList: any[] = null;

    public usageDetail: any = null;

    public hubConnection: HubConnection;
    private stats$: Observable<any>;
    private statsSubscription: Subscription;


    ngOnInit() {
        try {
            this.hubConnection = new HubConnectionBuilder()
                .configureLogging(LogLevel.Debug)
                .withUrl(environment.apiBaseUrl + '/main-stats')
                //?.withHubProtocol()
                .build();

            // TODO: Disconnect when component is not active
            this.hubConnection
                .start()
                .then(() => {

                    this.hubConnection.invoke("Init").then(r => {
                        this.statsData = r;
                    });

                    this.stats$ = <any>this.hubConnection.stream("StreamMainStats");

                    this.statsSubscription = this.stats$.subscribe(<any>{
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
                console.info("!!!", e);
                this.isLoadProjectList = false;
            });
        }
        catch (e) {
            L2.handleException(e);
        }
    }

    ngOnDestroy() {
        try {
            if (this.hubConnection) {
                if (this.statsSubscription) {
                    this.statsSubscription.closed = true;
                    this.statsSubscription.unsubscribe();
                    this.statsSubscription = null;
                }
                this.hubConnection.stop();
                this.hubConnection = null;
            }
        }
        catch (e) {
            console.warn(e);
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
