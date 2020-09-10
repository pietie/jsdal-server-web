import { Component, OnInit } from '@angular/core';
import { L2 } from 'l2-lib/L2';
import { ApiService } from '~/services/api';
import { HubConnectionBuilder, HubConnection, LogLevel } from '@microsoft/signalr';
import { MatMenu, MatMenuTrigger, MenuPositionX, MenuPositionY } from '@angular/material/menu';

@Component({
  selector: 'background-threads-tab',
  templateUrl: './background-threads.component.html',
  styleUrls: ['./background-threads.component.css']
})
export class BackgroundThreadsComponent implements OnInit {

  instances: { Name: string, IsRunning: boolean, EndpointPedigree: string, Status: string, Progress: number, Description: string }[];
  instanceKeys: string[];
  hubConnection: HubConnection;

  instanceSettings: { [key: string]: any } = {};

  constructor(public api: ApiService) {

  }


  ngOnInit() {
    try {

      this.hubConnection = new HubConnectionBuilder()
        .configureLogging(LogLevel.Debug)
        .withUrl(this.api.apiBaseUrl + '/bgplugin-hub')
        .build();

      this.hubConnection
        .start()
        .then(() => {

          this.hubConnection.on("updateData", data => {

            if (this.instances) {

              this.instanceSettings[data.InstanceId] = this.instanceSettings[data.InstanceId] || {};
              //console.log("%s==>",data.InstanceId, this.instanceSettings[data.InstanceId]);
              this.instances[data.InstanceId] = { ...this.instances[data.InstanceId], ...data };
            }
          });

          // // TODO: Can we wrap this up into a single 'updateData' function and then just update the properties that match! This was we can sent IsRunning etc updates as well or multiple props at the same time...
          // this.hubConnection.on("updateStatus", data => {
          //   if (this.instances) {
          //     this.instances[data.InstanceId].Status = data.Status;
          //   }
          //   //console.info("update status", data);
          // });

          // this.hubConnection.on("updateProgress", data => {
          //   if (this.instances) {
          //     this.instances[data.InstanceId].Progress = data.Progress;
          //   }
          //   //console.info("update progress", data);
          // });

          this.hubConnection.invoke("JoinBrowserDebugGroup");

          this.hubConnection.on("console.log", (data) => {
            if (data && this.instanceSettings[data.InstanceId].EnableBrowserConsole) {
              this.consoleTagLog(console.log, data, '#000', '#fff', data.Line);
            }
          });

          this.hubConnection.on("console.info", (data) => {
            if (data && this.instanceSettings[data.InstanceId].EnableBrowserConsole) {
              this.consoleTagLog(console.info, data, '#99e9eb', '#000', data.Line);
            }
          });

          this.hubConnection.on("console.warn", (data) => {
            if (data && this.instanceSettings[data.InstanceId].EnableBrowserConsole) {
              this.consoleTagLog(console.warn, data, '#fecf6d', '#000', data.Line);
            }
          });

          this.hubConnection.on("console.error", (data) => {
            if (data && this.instanceSettings[data.InstanceId].EnableBrowserConsole) {
              this.consoleTagLog(console.error, data, '#b34045', '#fff', data.Line);
            }
          });

          this.hubConnection.on("console.dir", (data) => {
            if (data && this.instanceSettings[data.InstanceId].EnableBrowserConsole) {
              console.dir(JSON.parse(data.Line));
            }
          });

          this.hubConnection.invoke("JoinAdminGroup").then(r => {
            console.log("JoinAdminGroup", r);
            this.instances = null;
            this.instanceKeys = null;
            this.instanceSettings = {};

            if (r && r.length > 0) {
              this.instances = r.reduce((map, obj) => { map[obj.InstanceId] = obj; return map; }, {});

              this.instanceKeys = Object.keys(this.instances);
              this.instanceKeys.forEach(k => { this.instanceSettings[k] = {}; })
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

  consoleTagLog(func, data: { Endpoint: string, InstanceId: string }, bgColor: string, foreColor: string, ...optionalParams) {
    //this.instances[data.InstanceId].Name
    let name: string = "(Unknown)";

    if (this.instances[data.InstanceId]) name = this.instances[data.InstanceId].Name;

    func.apply(console, [
      `%c${name}%c${data.Endpoint}`,
      `background: #eee;border: 1px #fff dotted;color: #333;font-weight:bold; padding: 2px 0.5em;`,
      `background: ${bgColor};border-radius: 0.5em;color: ${foreColor};font-weight: bold;padding: 2px 0.5em`,
      ...optionalParams,
    ]);
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

  settingsClicked(data: any, trigger: MatMenuTrigger, menuDiv: HTMLDivElement, ev: MouseEvent) {
    try {
      menuDiv.style.top = ev.pageY + "px";
      menuDiv.style.left = ev.pageX + "px";

      trigger.menuData = { data: data };
      trigger.openMenu();
    }
    catch (e) {
      L2.handleException(e);
    }
  }

  ngOnDestroy(): void {

  }

}
