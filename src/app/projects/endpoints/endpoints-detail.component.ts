import { Component } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

import { L2 } from 'l2-lib/L2';

import { ConnectionDialogComponent, AuthenticationType, MetadataViewerDialog } from '~/projects/dialogs';
import { EndpointDALService, IEndpoint } from '~/projects/endpoints/endpoint-dal.service';

import { BreadcrumbsService } from './../master/breadcrumbs/breadcrumbs.service';
import { ApiService } from '~/services/api';
import { BgTaskMonitorService } from '~/services/bgtask-monitor.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'endpoint-detail',
  templateUrl: './endpoints-detail.component.html',
  styleUrls: ['./endpoints-detail.components.css']
})
export class EndpointDetailComponent {
  projectName: string;
  dbSourceName: string;
  endpointName: string;


  endpoint: IEndpoint;
  dbSource: any;

  routeData$: Subscription;

  isCheckingOrm: boolean = true;
  isInstallingOrm: boolean = false;
  isInitialisingOrm: boolean = false;
  initProgress: number = 0;
  isUninstallingOrm: boolean = false;

  isMetadataShared: boolean = false;
  metadataSources: { Id: string, Pedigree: string }[];
  shareMetadataFromEndpoint: string;

  metadataCacheSummary: any;
  metadataDependencies: any[];



  constructor(public route: ActivatedRoute, public dialog: MatDialog, public router: Router,
    public endpointDAL: EndpointDALService, public breadcrumb: BreadcrumbsService,
    public api: ApiService, public bgTasks: BgTaskMonitorService) {

  }

  async ngOnInit() {
    try {

      this.metadataSources = await this.api.app.endpoint.getEndpointsWithMetadata();


      this.route.params.subscribe(async p => {

        this.projectName = this.route.snapshot.parent.params.project;
        this.dbSourceName = this.route.snapshot.parent.params.dbSource;
        this.endpointName = p.endpoint;

        this.dbSource = this.route.snapshot.parent.data.dbSource;

        // reset vars
        {

          this.isCheckingOrm = true;
          this.isInstallingOrm = false;
          this.isInitialisingOrm = false;
          this.initProgress = 0;
        }

        if (!this.routeData$) {
          this.routeData$ = this.route.data.subscribe(async d => {
            //console.log("route data", d.endpoint);
            this.projectName = d.endpoint.project;
            this.dbSourceName = d.endpoint.app;
            this.endpointName = d.endpoint.Name;

            this.setEndpointDetail(d.endpoint);

            this.refreshAll();
          });

        }

        this.breadcrumb.store([{ label: 'Projects', url: '/projects', params: [] }
          , { label: this.projectName, url: `/projects/${this.projectName}`, params: [] }
          , { label: this.dbSource.Name, url: `/projects/${this.projectName}/${this.dbSource.Name}`, params: [] }
          , { label: this.endpointName, url: `/projects/${this.projectName}/${this.dbSource.Name}/endpoint/${this.endpointName}`, params: [] }
        ]);


        // moved to route data changes handler
        // this.refreshSummaryInfo();
        // await this.bgTasks.init();
        // this.listenForInitProcessBgTask();

      });

    }
    catch (e) {
      L2.handleException(e);
    }
  }

  refreshAll() {
    this.refreshSummaryInfo();
    this.bgTasks.init().then(r => {
      this.listenForInitProcessBgTask();
    });

  }

  ngOnDestroy() {

    if (this.initBGTaskSubscription$) {
      this.initBGTaskSubscription$.unsubscribe();
      this.initBGTaskSubscription$ = null;
    }

    if (this.routeData$) {
      this.routeData$.unsubscribe();
      this.routeData$ = null;
    }
  }

  private refreshEndpointDetail(): Promise<any> {
    return this.endpointDAL.get(this.projectName, this.dbSourceName, this.endpointName).then(ep => {
      this.setEndpointDetail(ep);
    });
  }

  private setEndpointDetail(ep) {
    this.endpoint = ep;

    if (this.endpoint.IsOrmInstalled == null) {
      this.onRecheckOrmClicked();
    }
    else {
      this.isCheckingOrm = false;
    }
  }

  onInitORMClicked() {

    this.isInstallingOrm = true;

    this.api.app.endpoint.installOrm(this.projectName, this.dbSourceName, this.endpointName).then(resp => {

      if (resp.BgTaskKey) {
        L2.success("ORM successfully installed, performing first-time population...");

        this.isInstallingOrm = false;

        if (resp.Success) {
          this.isInitialisingOrm = true;

          //let obs = this.bgTasks.observeBgTask(`${this.endpoint.BgTaskKey}.ORM_INIT`);

          //this.listenForInitProcessBgTask(obs);
        }
      }
      else {
        L2.success("ORM successfully installed");
        this.isInstallingOrm = false;
        this.endpoint.IsOrmInstalled = true;
      }
    }).catch((_) => { this.isInstallingOrm = false });
  }

  initBGTaskSubscription$: Subscription;
  listenForInitProcessBgTask() {
    let listenForKey: string = `${this.endpoint.BgTaskKey}.ORM_INIT`;
    let obs = this.bgTasks.observeBgTask(listenForKey);

    if (this.initBGTaskSubscription$ != null) {
      this.initBGTaskSubscription$.unsubscribe();
      this.initBGTaskSubscription$ = null;
    }

    //console.log(this.endpoint.Name, " listening for ... ", this.endpoint.BgTaskKey);

    this.initBGTaskSubscription$ = obs.subscribe(bgTask => {
      if (bgTask == null || bgTask.Key != listenForKey) return;

      this.isInitialisingOrm = true;

      if (bgTask.IsDone) {
        this.isInitialisingOrm = false;

        if (bgTask.Exception == null) {
          this.endpoint.IsOrmInstalled = true;
        }
        else {
          L2.exclamation(bgTask.Exception);
        }
      }
      else {
        this.initProgress = bgTask.Progress;
      }

    });

  }

  onRecheckOrmClicked(forceRecheck: boolean = false) {
    this.isCheckingOrm = true;

    L2.fetchJson(`/api/endpoint/${this.endpointName}/checkOrm?projectName=${this.projectName}&dbSourceName=${this.dbSourceName}&forceRecheck=${forceRecheck}`)
      .then((resp: any) => {
        this.isCheckingOrm = false;
        this.endpoint.IsOrmInstalled = resp.Data == null;


        if (this.endpoint.IsOrmInstalled) {
          L2.success("ORM is installed.");
        }

      }).catch((_) => this.isCheckingOrm = false);
  }


  performOrmUninstall() {
    this.isUninstallingOrm = true;
    return L2.postJson(`/api/endpoint/${this.endpointName}/uninstallOrm?projectName=${this.projectName}&dbSourceName=${this.dbSourceName}`)
      .then(resp => {
        this.isUninstallingOrm = false;
        L2.success("ORM successfully uninstalled");

        this.endpoint.IsOrmInstalled = false;

      }).catch((_) => { this.isUninstallingOrm = false; });
  }

  onUninstallOrmClicked() {

    L2.confirm(`Are you sure you want to uninstall the ORM from <strong>${this.endpointName}</strong>?`, "Confirm action").then(r => {
      if (r) this.performOrmUninstall();
    });
  }

  changeConnectionClicked(isMetadata: boolean, row: any) {
    try {

      let dialogRef = this.dialog.open(ConnectionDialogComponent);

      dialogRef.componentInstance.dataSourceMode = false;

      let title: string = "Change metadata connection";

      if (!isMetadata) title = "Change run-time connection";

      row = row || {};

      if (row.Port == null) row.Port = 1433;

      if (row) {
        dialogRef.componentInstance.title = title;
        dialogRef.componentInstance.data = {
          dataSource: row.DataSource,
          database: row.InitialCatalog,
          username: row.UserID,
          password: null,
          port: row.Port,
          encrypt: row.Encrypt
        };
      }

      dialogRef.afterClosed().subscribe(r => {
        if (r) {

          try {
            let obj = dialogRef.componentInstance.data;

            if (obj.authType == AuthenticationType.Windows) {
              obj.username = obj.password = null;
            }

            this.endpointDAL.updateConnection({
              project: this.projectName,
              dbSource: this.dbSourceName,
              endpoint: this.endpointName,
              isMetadata: isMetadata,
              dataSource: obj.dataSource,
              catalog: obj.database,
              authType: obj.authType,
              username: obj.username,
              password: obj.password,
              port: obj.port,
              encrypt: obj.encrypt

            }).then(r => {
              // TODO: Show loading indicator of some sort? Use await before showing success??
              this.refreshEndpointDetail();

              if (isMetadata) {
                L2.success("Metadata connection updated successfully.");
              }
              else {
                L2.success("Run-time connection updated successfully.");
              }

            });
          }
          catch (e) {
            L2.handleException(e);
          }
        }
      });
    }
    catch (e) {
      L2.handleException(e);
    }
  }

  public refreshSummaryInfo() {

    L2.fetchJson(`/api/endpoint/${this.endpointName}/summary?projectName=${this.projectName}&dbSource=${this.dbSource.Name}`).then((r: any) => {
      this.metadataCacheSummary = r.Data;
    });


    this.api.app.endpoint
      .getMetadataDependencies({ project: this.projectName, app: this.dbSourceName, endpoint: this.endpointName })
      .then(r => {
        this.metadataDependencies = r;
      });

  }

  public getLastUpdatedAge(dt) {

    var diffInMilliseconds = moment().diff(moment(new Date(dt)), "ms");

    // for usage see https://github.com/EvanHahn/HumanizeDuration.js
    return humanizeDuration(diffInMilliseconds, { round: true, units: ["d", "h", "m"] });
  }


  public viewCachedMetadata() {
    let dialogRef = this.dialog.open(MetadataViewerDialog, { width: "800px" });

    dialogRef.componentInstance.projectName = this.projectName;
    dialogRef.componentInstance.dbSourceName = this.dbSource.Name;
    dialogRef.componentInstance.endpoint = this.endpointName;
  }

  public clearDbSourceCache() {

    L2.confirm(`You are about to clear the current endpoint's cache.<br/>Are you sure?`, "Confirm action")
      .then((r) => {
        if (r) {
          L2.postJson(`/api/endpoint/${this.endpointName}/clearcache?projectName=${this.projectName}&dbSource=${this.dbSource.Name}`)
            .then(r => {
              L2.success("Cached clear successfully");
              this.refreshSummaryInfo();
            });
        }


      });
  }

  enableMetadatCapturing(enable: boolean) {
    if (!enable) {

      L2.confirm("Are you sure you want to disable metadata capturing on this endpoint?", "Confirm action").then(r => {
        if (r) {
          this.endpointDAL.enableDisableMetadataCapturing(this.projectName, this.dbSourceName, this.endpointName, false).then(r => {
            L2.success("Metadata capturing disabled");
            this.refreshEndpointDetail();
          });
        }
      });

    }
    else {
      this.endpointDAL.enableDisableMetadataCapturing(this.projectName, this.dbSourceName, this.endpointName, true).then(r => {
        L2.success("Metadata capturing enabled");
        this.refreshEndpointDetail();

      });
    }
  }

  setupMetdataSharing(id: string) {

    this.api.app.endpoint.setupSharedMetadata({ project: this.projectName, app: this.dbSourceName, endpoint: this.endpointName, srcEndpointId: id })
      .then(r => {
        L2.success("Metadata sharing configured successfully");

        let url = this.route.snapshot.pathFromRoot.map(v => v.url.map(segment => segment.toString()).join('/')).join('/');

        this.isMetadataShared = false;

        this.router.navigate([url], {
          queryParams: { refresh: new Date().getTime() }
        });

      });
  }

  clearSharedMetadata() {

    L2.confirm("Are you sure you wish to remove the current metadata sharing?", "Corfirm action").then(c => {
      if (!c) return;

      this.api.app.endpoint.clearSharedMetadata({ project: this.projectName, app: this.dbSourceName, endpoint: this.endpointName }).then(r => {

        L2.success("Metadata sharing removed");

        let url = this.route.snapshot.pathFromRoot.map(v => v.url.map(segment => segment.toString()).join('/')).join('/');

        this.isMetadataShared = false;

        this.router.navigate([url], {
          queryParams: { refresh: new Date().getTime() }
        });
      });

    })
  }


}
