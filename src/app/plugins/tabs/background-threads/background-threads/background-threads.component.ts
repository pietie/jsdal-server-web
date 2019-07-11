import { Component, OnInit } from '@angular/core';
import { L2 } from 'l2-lib/L2';
import { ApiService } from '~/services/api';
import { HubConnectionBuilder, HubConnection, LogLevel } from '@aspnet/signalr';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'background-threads-tab',
  templateUrl: './background-threads.component.html',
  styleUrls: ['./background-threads.component.css']
})
export class BackgroundThreadsComponent implements OnInit {

  instances: { Name: string, IsRunning: boolean, EndpointPedigree: string, Status: string, Progress: number, Description: string }[];
  instanceKeys: string[];
  hubConnection: HubConnection;

  constructor(public api: ApiService) { }

  ngOnInit() {
    try {

      this.hubConnection = new HubConnectionBuilder()
        .configureLogging(LogLevel.Debug)
        .withUrl(environment.apiBaseUrl + '/bgplugin-hub')
        .build();

      this.hubConnection
        .start()
        .then(() => {

          // TODO: Can we wrap this up into a single 'updateData' function and then just update the properties that match! This was we can sent IsRunning etc updates as well or multiple props at the same time...
          this.hubConnection.on("updateStatus", data => {
            if (this.instances) {
              this.instances[data.InstanceId].Status = data.Status;
            }
            //console.info("update status", data);
          });

          this.hubConnection.on("updateProgress", data => {
            if (this.instances) {
              this.instances[data.InstanceId].Progress = data.Progress;
            }
            //console.info("update progress", data);
          });

          this.hubConnection.invoke("JoinAdminGroup").then(r => {
            if (r) {
              this.instances = r.reduce((map, obj) => { map[obj.InstanceId] = obj; return map; }, {});
              this.instanceKeys = Object.keys(this.instances);
            }
          });
        });


      // this.api.app.plugins.getAllBackgroundThreads()
      //   .then(r => {
      //     console.log("All BG Threads", r);
      //   });

    }
    catch (e) {
      L2.handleException(e);
    }
  }

  start(row) {
    this.api.app.plugins.startBgThreadInstance(row.InstanceId).then(r => {
      console.log("start resp ", r);
    });
  }

  stop(row) {
    this.api.app.plugins.stopBgThreadInstance(row.InstanceId).then(r => {
      console.log("stop resp ", r);
    });
  }

  ngOnDestroy(): void {

  }

}
