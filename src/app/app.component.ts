import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from './account/account.service'
import { MatDialog, MatSnackBar } from '@angular/material';

import { environment } from './../environments/environment';
import { L2 } from 'l2-lib/L2';


import { HubConnectionBuilder, HubConnection, LogLevel, JsonHubProtocol } from '@aspnet/signalr';


import { Observable, Subscription } from 'rxjs';
import { L2MsgHandler } from './L2MsgHandler';


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css']
})
export class AppComponent {

    constructor(public accountService: AccountService,
        public router: Router,
        public changeDetectorRef: ChangeDetectorRef,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        public activatedRoute: ActivatedRoute
    ) {

        L2.registerOutputMessageHandler(new L2MsgHandler(this.dialog, this.snackBar, this.router, null));
    }

    public isDisconnected: boolean = false;
    public hubConnection: HubConnection;
    private stats$: Observable<any>;
    private statsSubscription: Subscription;

    ngOnInit() {

        try {
            this.accountService.whenLoggedIn.subscribe(loggedIn => {
                this.changeDetectorRef.detectChanges();
            });

this.createHubConnection();
        }
        catch (e) {
            console.error("heartbeat error", e);
            L2.handleException(e);
        }


    }

    createHubConnection() {
        this.hubConnection = new HubConnectionBuilder()
            .configureLogging(LogLevel.Debug)
            .withUrl(environment.apiBaseUrl + '/heartbeat')
            .withHubProtocol(new JsonHubProtocol())
            .build();

        this.hubConnection.onclose(e => {
            console.info("Hub connection closed");
            this.isDisconnected = true;

        });
        this.hubConnection.start()
            .then(() => {

                this.hubConnection.invoke("Init").then(r => {

                });

                this.stats$ = <any>this.hubConnection.stream("StreamTick");

                this.statsSubscription = this.stats$.subscribe(<any>{
                    next: (n => {
                        this.isDisconnected = false;
                    }),
                    error: function (err) {
                        this.isDisconnected = true;
                        console.log("ERROR!!!! with heart beat", err);
                    }
                });

            }).catch(e => {
                console.info("error from catch", e);
            });
    }

    gotoLogin() {

        (<any>window).location = "login";
    }

    public go(url: string) {
        this.router.navigate([url], { relativeTo: this.activatedRoute });
    }

}