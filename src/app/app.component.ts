import { Component, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from './account/account.service'
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { environment } from './../environments/environment';
import { L2 } from 'l2-lib/L2';


import { HubConnectionBuilder, HubConnection, LogLevel, JsonHubProtocol } from '@microsoft/signalr';


import { Observable, Subscription } from 'rxjs';
import { L2MsgHandler } from './L2MsgHandler';
import { ApiService } from './services/api';


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
    public activatedRoute: ActivatedRoute,
    public api: ApiService
  ) {

    L2.registerOutputMessageHandler(new L2MsgHandler(this.dialog, this.snackBar, this.router, null));
  }

  public isDisconnected: boolean = false;
  public hubConnection: HubConnection;

  async ngOnInit() {

    try {
      // wait for config to finish loading first
      await this.api.jsDALConfig$;


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

  ngOnDestroy(): void {
    if (this.hubConnection) {
      this.hubConnection.stop();
      this.hubConnection = null;
    }
  }

  async createHubConnection() {

    this.hubConnection = new HubConnectionBuilder()
      .configureLogging(LogLevel.Debug)
      .withUrl(this.api.apiBaseUrl + '/heartbeat')
      .withHubProtocol(new JsonHubProtocol())
      .build();

    this.hubConnection.onclose(e => {
      console.info("Hub connection closed");
      this.isDisconnected = true;
    });

    this.hubConnection.start()
      .then(() => {
        console.info("Connected to heart beat hub");
        this.hubConnection.on("tick", tick => { this.isDisconnected = false; });

        this.hubConnection.invoke("Init").then(r => {

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
