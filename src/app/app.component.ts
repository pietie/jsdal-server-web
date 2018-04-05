import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from './account/account.service'
import { MatDialog, MatSnackBar } from '@angular/material';


import { L2 } from 'l2-lib/L2';


import { HubConnection } from '@aspnet/signalr-client';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
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

            this.hubConnection = new HubConnection('https://api.jsdal.com/heartbeat'); // TODO: sort out url
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
                            console.log("ERROR!!!! with heart beat");
                        }
                    });

                });
        }
        catch (e) {
            L2.handleException(e);
        }


    }

    gotoLogin() {

        (<any>window).location = "login";
    }

    public go(url: string) {
        this.router.navigate([url], { relativeTo: this.activatedRoute });
    }

}