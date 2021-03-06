import { Injectable } from '@angular/core';
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr';
import { Observable, Subscription, Subject, BehaviorSubject } from 'rxjs';
import { L2 } from 'l2-lib/L2';
import { ApiService } from './api';

@Injectable({
  providedIn: 'root'
})
export class BgTaskMonitorService {

  private hubConnection: HubConnection;

  // obsLookup["BGTask"]["KEY"] ==> Observable .. e.g. where key could be ProjName/AppName/EndpointName/ORM_INIT -- thus a specific indicator of the type of task and the context it is in
  //private obsLookup: { [id: string]: { [key: string]: BehaviorSubject<BgTaskResponse> } } = {};
  private obsLookup: { [id: string]: BehaviorSubject<BgTaskResponse> } = {};


  constructor(public api:ApiService) {
    this.init();
  }

  private initPromise: Promise<void>;

  init(): Promise<void> {
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      try {
        this.hubConnection = new HubConnectionBuilder()
          .configureLogging(LogLevel.Debug)
          .withUrl(this.api.apiBaseUrl + '/bgtasks-hub')
          .build();

        this.hubConnection.start()
          .then(() => {

            this.hubConnection.on("update", (bgTask: BgTaskResponse) => {
              let obs = this.obsLookup[bgTask.Key];

              obs.next(bgTask);

              if (bgTask.IsDone) {
                if (obs) obs.complete();
                delete this.obsLookup[bgTask.Key];
              }
            });

            this.hubConnection.invoke("Init").then(r => {

            });

            resolve();
          });
      }
      catch (e) {
        L2.handleException(e);
        reject(e);
      }

    });

    return this.initPromise;
  } // init()

  // subscribe(fn: ((next: { Progress?: number, Guid: string, ReturnValue: string, Exception: string, Name: string, IsDone: boolean }) => void)): Subscription {
  //   return this.stats$.subscribe({ next: fn });
  // }

  ngOnDestroy() {
    try {
      if (this.hubConnection) {
        this.hubConnection.stop();
        this.hubConnection = null;
      }
    }
    catch (e) {
      console.warn(e);
    }
  }

  observeBgTask(key: string): Observable<BgTaskResponse> {
    if (this.obsLookup[key] == null) {
      this.obsLookup[key] = new BehaviorSubject<BgTaskResponse>(null);
    }

    return this.obsLookup[key].asObservable();
  }


}


declare type BgTaskResponse = { Progress?: number, Key: string, ReturnValue: string, Exception: string, Name: string, IsDone: boolean };
