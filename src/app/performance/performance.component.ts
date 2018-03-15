import { Component } from '@angular/core'
import { L2 } from 'l2-lib/L2';

import { HubConnection } from '@aspnet/signalr-client';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
    templateUrl: 'performance.component.html'
})
export class PerformanceComponent {

    public projectList: any;

    public perfraw: any;

    public hubConnection: HubConnection;

    public realtimeExectuionData: any;
    private realtimeStream$: Observable<any>;
    private realtimeExecutionsSubscription: Subscription;

    constructor() {
        this.refresh();
    }

    ngOnInit() {
        try {
            this.hubConnection = new HubConnection('http://localhost:9086/performance-realtime-hub'); // TODO: sort out url

            // TODO: Disconnect when component is not active
            this.hubConnection.start()
                .then(() => {

                    this.hubConnection.invoke("Init").then(r => {
                        this.realtimeExectuionData = r;
                    });

                    this.realtimeStream$ = <any>this.hubConnection.stream("StreamRealtimeList");

                    this.realtimeExecutionsSubscription = this.realtimeStream$.subscribe(<any>{
                        next: (n => { this.realtimeExectuionData = n; }),
                        error: function (err) {
                            console.info("Streaming error");
                            console.error(err);
                        }
                    });

                });

                this.updateRealtimeRunningTimes();
        }
        catch (e) {
            L2.handleException(e);
        }
    }

    updateRealtimeRunningTimes() {

    //!    setTimeout(()=>this.updateRealtimeRunningTimes(), 300);
    }

    ngOnDestroy() {
        try {
            if (this.hubConnection) {
                if (this.realtimeExecutionsSubscription) {
                    this.realtimeExecutionsSubscription.closed = true;
                    this.realtimeExecutionsSubscription.unsubscribe();
                    this.realtimeExecutionsSubscription = null;
                }
                this.hubConnection.stop();
                this.hubConnection = null;
            }
        }
        catch (e) {
            console.warn(e);
        }
    }


    refresh() {

        L2.fetchJson("/api/project").then((json: any) => {
            this.projectList = json.Data;
        });


        L2.fetchJson("/api/performance/tmp-executionlist").then((json: any) => {
            this.perfraw = json.Data;
        });

    }

    getRunningTime(row) {
        if (!row) return null;
        if (row.durationMS != null) return null;

        let createdMom = moment(row.createdEpoch);

        let diff = moment().diff(createdMom, 'ms');

        if (diff < 0) diff = 0;

        return this.formatMilliseconds(diff);
    }

    formatMilliseconds(ms:number)
    {
        if (ms == null) return null;
        if (ms == 0) return "0s";
        var s = (ms / 1000.0).toFixed(2);

        return s+ "s";
    }


}