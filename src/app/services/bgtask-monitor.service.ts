import { Injectable } from '@angular/core';
import { HubConnectionBuilder, HubConnection, LogLevel } from '@aspnet/signalr';
import { Observable, Subscription, Subject, BehaviorSubject } from 'rxjs';
import { environment } from '~/../environments/environment';
import { L2 } from 'l2-lib/L2';
import { timestamp } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BgTaskMonitorService {

  private hubConnection: HubConnection;
  private stats$: Observable<any>;
  private bgTasksSubscription: Subscription;

  // obsLookup["BGTask"]["KEY"] ==> Observable .. e.g. where key could be ProjName/AppName/EndpointName/ORM_INIT -- thus a specific indicator of the type of task and the context it is in
  //private obsLookup: { [id: string]: { [key: string]: BehaviorSubject<BgTaskResponse> } } = {};
  private obsLookup: { [id: string]: BehaviorSubject<BgTaskResponse> } = {};


  constructor() {
    this.init();
  }

  private initPromise: Promise<void>;

  init(): Promise<void> {
    if (this.initPromise) return this.initPromise;
    this.initPromise = new Promise((resolve, reject) => {
      try {
        this.hubConnection = new HubConnectionBuilder()
          .configureLogging(LogLevel.Debug)
          .withUrl(environment.apiBaseUrl + '/bgtasks-hub')
          .build();

        // TODO: Disconnect when component is not active
        this.hubConnection.start()
          .then(() => {

            this.stats$ = <any>this.hubConnection.stream("Stream");

            // TODO: Capture Subscription and unsub when necessary

            this.bgTasksSubscription = this.stats$.subscribe(<any>{
              next: ((bgTask: BgTaskResponse) => {

                let obs = this.obsLookup[bgTask.Key];

                obs.next(bgTask);

                if (bgTask.IsDone) {
                  if (obs) obs.complete();
                  delete this.obsLookup[bgTask.Key];
                }

              }),
              error: function (err) {
                console.info("Streaming error");
                console.error(err);
              }
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
      console.info("service ngOnDestroy called");
      if (this.hubConnection) {
        if (this.bgTasksSubscription) {
          this.bgTasksSubscription.closed = true;
          this.bgTasksSubscription.unsubscribe();
          this.bgTasksSubscription = null;
        }
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