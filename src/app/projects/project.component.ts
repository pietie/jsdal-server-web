import {
    Component, Injector, ViewChild, ApplicationRef, EventEmitter, Output, Host, ComponentFactoryResolver, ViewContainerRef, Input
} from '@angular/core'

import { trigger, state, style, transition, animate } from '@angular/animations';

import { MdDialog, MdDialogRef } from '@angular/material';

import { ProjectService, IDBSource } from './projects.service'

import { DataSourceDialog, AuthenticationType } from './dialogs';

import { ActivatedRoute, Router } from '@angular/router';
import { Route, CanDeactivate } from '@angular/router'
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/toPromise';


import { L2  } from 'l2-lib/L2';

@Component({
    selector: 'ManageProject',
    templateUrl: './project.component.html',
    animations: [
        trigger('componentState', [
            state('void', style({ opacity: 0, transform: 'translateX(-100%)' })),
            state('enterComponent', style({ opacity: 1, transform: 'translateX(0)' })),
            state('exitComponent', style({ opacity: 0.5, transform: 'translateX(-100%)' })),
            transition('* => enterComponent', animate('300ms ease-in')),
            transition('enterComponent => exitComponent', animate('150ms ease-in'))
        ]),
    ]
})
export class ProjectComponent {
    public projectName: string;
    public dbList: any;

    public get name(): string { return this.projectName; }

    public componentState = "enterComponent";

    constructor(
        public projectService: ProjectService
        , public route: ActivatedRoute
        , public router: Router
        , public dialog: MdDialog
        , public componentFactoryResolver: ComponentFactoryResolver
        , public injector: Injector
        , public appRef: ApplicationRef
        , public viewContainerRef: ViewContainerRef
    ) {
        this.route.params.subscribe(params => {
            console.log("project.component", params);
            this.projectName = params["name"];
            this.componentState = "enterComponent";
            this.refreshDbList();
        });



    }

    ngOnInit() { }

    canDeactivate(): Observable<boolean> | boolean {
        this.componentState = "exitComponent";
        return Observable.of(true).delay(200); // TODO: Hook into animation complete event
    }

    refreshDbList() {
        this.projectService.getDbSourceList(this.projectName).then(r => {
            this.dbList = r; // TODO: bind grid directly to service  
        });
    }



    public formatDbCboItem(item) {
        if (!item.Data) return;
        return $(`<div class="databaseSourceCboItem"><div class="h">${item.text}</div><div class="line2">${item.Data.DataSource}; ${item.Data.InitialCatalog}</div></div>`);
    }

    public onAddEditDbSourceClicked(row) {
        try {

            let dialogRef = this.dialog.open(DataSourceDialog);

            dialogRef.componentInstance.title = "Add data source";

            if (row) {
                dialogRef.componentInstance.title = "Update data source";

                dialogRef.componentInstance.data = {
                    logicalName: row.Name,
                    dataSource: row.DataSource,
                    database: row.InitialCatalog,
                    username: row.UserID,
                    password: null,
                    authType: <any>(row.UserID ? AuthenticationType.SQL : AuthenticationType.Windows),
                    defaultRuleMode: row.DefaultRuleMode.toString(),
                    guid: row.Guid,
                    port: row.port,
                    instanceName: row.instanceName
                };
            }

            dialogRef.afterClosed().subscribe(r => {
                if (r) {

                    try {
                        let obj = dialogRef.componentInstance.data;

                        if (!row) obj.guid = null;

                        if (obj.authType == <any>AuthenticationType.Windows) {
                            obj.username = obj.password = null;
                        }

                        if (!row) {
                            // add new
                            L2.postJson(`/api/database?project=${this.projectName}&dataSource=${obj.dataSource}&catalog=${obj.database}&username=${L2.nullToEmpty(obj.username)}&password=${L2.nullToEmpty(obj.password)}&jsNamespace=${L2.nullToEmpty(null)}&defaultRoleMode=${obj.defaultRuleMode}&port=${obj.port}&instanceName=${L2.nullToEmpty(obj.instanceName)}`
                                , { body: JSON.stringify(obj.logicalName) }).then(r => {
                                    L2.success("New database source added successfully");
                                });
                        }
                        else {
                            // update
                            L2.putJson(`/api/database/update?project=${this.projectName}&oldName=${row.Name}&dataSource=${obj.dataSource}&catalog=${obj.database}&username=${L2.nullToEmpty(obj.username)}&password=${L2.nullToEmpty(obj.password)}&jsNamespace=${L2.nullToEmpty(null)}&defaultRoleMode=${obj.defaultRuleMode}&port=${obj.port}&instanceName=${L2.nullToEmpty(obj.instanceName)}`
                                , { body: JSON.stringify(obj.logicalName) }).then(r => {
                                    L2.success("Database source updated successfully");
                                });
                        }

                        this.refreshDbList();
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


    onDeleteDatabase(row) {
        L2.confirm(`Are you sure you want to delete the database source <strong>${row.Name}</strong>?`, "Confirm action").then(r => {
            if (r) this.deleteDatabaseSource(row.Name);
        });
    }

    public deleteDatabaseSource(name: string) {
        return L2.deleteJson(`/api/database/${name}?projectName=${this.projectName}`, { body: JSON.stringify(name) }).then(() => {
            L2.success(`Database source ${name} successfully deleted.`);

            this.refreshDbList();

            let child: any = this.route.firstChild;

            // redirect back up to this level if a child has been deleted
            if (child && child.params.getValue().name == name) {
                this.router.navigate(['./'], { relativeTo: this.route });
            }
        });
    }
}

