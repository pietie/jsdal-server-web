import { Component } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';

import { L2 } from 'l2-lib/L2';

import { ConnectionDialogComponent, AuthenticationType } from '~/projects/dialogs';
import { EndpointDALService, IEndpoint } from '~/projects/endpoints/endpoint-dal.service';

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

    constructor(public route: ActivatedRoute, public dialog: MatDialog, public router: Router, public endpointDAL: EndpointDALService) {

    }

    ngOnInit() {
        try {


            this.route.params.subscribe(p => {

                this.projectName = this.route.snapshot.parent.params.project;
                this.dbSourceName = this.route.snapshot.parent.params.dbSource;
                this.endpointName = p.endpoint;

                this.dbSource = this.route.snapshot.parent.data.dbSource;

                this.route.data.subscribe(d => {

                    this.setEndpointDetail(d.endpoint);
                });

            });

        }
        catch (e) {
            L2.handleException(e);
        }
    }

    private refreshEndpointDetail() : Promise<any> {
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

    onInitializeClicked() {

        this.isInstallingOrm = true;

        L2.postJson(`/api/endpoint/${this.endpointName}/installOrm?projectName=${this.projectName}&dbSourceName=${this.dbSourceName}`)
            .then(resp => {
                L2.success("ORM successfully installed");
                this.isInstallingOrm = false;
                this.endpoint.IsOrmInstalled = true;

            }).catch((_) => { this.isInstallingOrm = false });
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



}