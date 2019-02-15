import { Component } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';

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

    isCheckingOrm: boolean = true;
    isInstallingOrm: boolean = false;
    isInitialisingOrm: boolean = false;
    initProgress: number = 0;

    metadataCacheSummary: any;

    constructor(public route: ActivatedRoute, public dialog: MatDialog, public router: Router,
        public endpointDAL: EndpointDALService, public breadcrumb: BreadcrumbsService,
        public api: ApiService, public bgTasks: BgTaskMonitorService) {

    }

    ngOnInit() {
        try {


            this.route.params.subscribe(async p => {

                this.projectName = this.route.snapshot.parent.params.project;
                this.dbSourceName = this.route.snapshot.parent.params.dbSource;
                this.endpointName = p.endpoint;

                this.dbSource = this.route.snapshot.parent.data.dbSource;

                this.route.data.subscribe(d => {

                    this.setEndpointDetail(d.endpoint);
                });


                this.breadcrumb.store([{ label: 'Projects', url: '/projects', params: [] }
                    , { label: this.projectName, url: `/projects/${this.projectName}`, params: [] }
                    , { label: this.dbSource.Name, url: `/projects/${this.projectName}/${this.dbSource.Name}`, params: [] }
                    , { label: this.endpointName, url: `/projects/${this.projectName}/${this.dbSource.Name}/endpoint/${this.endpointName}`, params: [] }
                ]);


                this.refreshSummaryInfo();

                await this.bgTasks.init();

                this.listenForInitProcessBgTask();

            });

        }
        catch (e) {
            L2.handleException(e);
        }
    }

    ngOnDestroy() {
        if (this.initBGTaskSubscription$) {
            this.initBGTaskSubscription$.unsubscribe();
            this.initBGTaskSubscription$ = null;
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

        let obs = this.bgTasks.observeBgTask(`${this.endpoint.BgTaskKey}.ORM_INIT`);

        this.initBGTaskSubscription$ = obs.subscribe(bgTask => {
            if (bgTask == null) return;
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
        return L2.postJson(`/api/endpoint/${this.endpointName}/uninstallOrm?projectName=${this.projectName}&dbSourceName=${this.dbSourceName}`).then(resp => {
            L2.success("ORM successfully uninstalled");

            this.endpoint.IsOrmInstalled = false;

        }).catch((_) => { this.isInstallingOrm = false });
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

            row =  row || { };

            if (row.Port == null) row.Port = 1433;

            if (row) {
                dialogRef.componentInstance.title = title;
                dialogRef.componentInstance.data = {
                    dataSource: row.DataSource,
                    database: row.InitialCatalog,
                    username: row.UserID,
                    password: null,
                    port: row.Port
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
                            port: obj.port
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
}