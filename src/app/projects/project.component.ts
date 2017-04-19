import {
    Component, Injector, ViewChild, ApplicationRef, EventEmitter, Output, Host, ComponentFactoryResolver, ViewContainerRef, Input,
    trigger, state, style, transition, animate
} from '@angular/core'

import { MdDialog, MdDialogRef } from '@angular/material';

import { ProjectService, IDBSource } from './projects.service'

import { DataSourceDialog, AuthenticationType } from './dialogs';

import { ActivatedRoute, Router } from '@angular/router';
import { Route, CanDeactivate } from '@angular/router'
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/toPromise';


import L2 from 'l2-lib/L2';

@Component({
    selector: 'addNewDatabaseSourceDialog',
    inputs: ['logicalName:logicalName'],
    template: `
<div #dlg class="modal fade" id="addProductModal" data-backdrop="static">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                         <h4 class="modal-title"><i class="fa fa-plus-circle pr8"></i><span *ngIf="!dbSource">Add</span><span *ngIf="dbSource">Edit</span> database source</h4>
                    </div>
                    <div class="modal-body">
                                <div class="form-horizontal">
                                    <div class="form-group">
                                        <label class="col-sm-3 control-label" for="logicalName">Logical name</label>
                                        <div class="col-sm-8"><input [disabled]="shouldDisableMain()" type="text" class="form-control" id="logicalName" placeholder="Logical name" [(ngModel)]="logicalName" required/></div>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-sm-3 control-label" for="datasource">Datasource</label>
                                        <div class="col-sm-8"><input [disabled]="shouldDisableMain()" type="text" class="form-control" id="datasource" placeholder="Server name or IP" [(ngModel)]="datasource" required/>
                                    </div>

                                     <div class="form-group">
                                        <label class="col-sm-3 control-label" for="username">Auth type</label>
                                        <div class="col-sm-8">
                                            <label class="radio-inline"><input [disabled]="shouldDisableMain()" id="authTypeWindows" type="radio" name="authType" value="100" [checked]="authenticationType" (change)="authenticationType = 100" /> Windows</label>
                                            <label class="radio-inline"><input [disabled]="shouldDisableMain()" id="authTypeSQL" type="radio" name="authType" value="200" [checked]="authenticationType" (change)="authenticationType = 200" /> SQL</label>

                                        </div>
                                    </div>                                    

                                    </div>
                                    <div class="form-group">
                                        <label class="col-sm-3 control-label" for="username">Username</label>
                                        <div class="col-sm-8"><input [disabled]="shouldDisableMain() || authenticationType == '100'" type="text" class="form-control" id="username" placeholder="Username" [(ngModel)]="username" /></div>
                                    </div>
                                    <div class="form-group">
                                        <label class="col-sm-3 control-label" for="password">Password</label>
                                        <div class="col-sm-8"><input [disabled]="shouldDisableMain()|| authenticationType == '100'" type="password" autocomplete="off" class="form-control" id="password"  [(ngModel)]="password" placeholder="Password" /></div>
                                    </div>

                                    <div class="form-group anchorNest">
                                            <label class="col-sm-3 control-label" for="database">Database</label>
                                            <div class="col-sm-8"><select #dbCbo type="text" class="form-control" id="database"  [(ngModel)]="database" style="width:100%;" required></select>
                                              <a id="loadFromServer" [class.disabled]="isLoadingDbList || shouldDisableMain()" (click)="onLoadDbList()">({{ !isLoadingDbList? "load from server":"loading, please wait..." }})</a>
                                            </div>
                                    </div>


                                    <div class="form-group">
                                        <label class="col-sm-3 control-label" for="jsNamespace">Js namespace</label>
                                        <div class="col-sm-8"><input [disabled]="shouldDisableMain()" type="text" class="form-control" id="jsNamespace"  [(ngModel)]="jsNamespace" placeholder="Namespace for .js file"/></div>
                                    </div>

                                    <div class="form-group" [class.has-error]="defaulRuleMode=='-1'">
                                        <label class="col-sm-3 control-label" for="defaulRuleMode">Default rule mode</label>
                                        <div class="col-sm-8">
                                            <select [disabled]="shouldDisableMain()"  id="defaulRuleMode" class="form-control" [(ngModel)]="defaulRuleMode">
                                                    <option value="-1">(Select)</option>
                                                    <option value="0">Include all routines</option>
                                                    <option value="1">Exclude all routines</option>
                                            </select>
                                        </div>
                                    </div>


                                    <div class="form-group">
                                        <label class="col-sm-3 control-label"></label>
                                        <div class="col-sm-8"><button [disabled]="shouldDisableMain()" (click)="onTestConnectionClicked()" class="form-control btn btn-info" id="testConnection">{{isTestingDbDetails? "Testing...":"Test connection"}}</button></div>
                                    </div>


                                   

                             </div>

                           
                    <div class="modal-footer">
                        <button (click)="onAddClicked()" id="add" type="button" class="btn btn-primary"><span *ngIf="!dbSource">Add</span><span *ngIf="dbSource">Update</span></button>
                        <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
</div>
      `,
    styles: [`

a.a { cursor: pointer }


`

    ]
})
export class AddNewDatabaseSourceDialog {
    @Output() ready: EventEmitter<any> = new EventEmitter();
    @Output() onNewDbAdded: EventEmitter<any> = new EventEmitter();
    @ViewChild('dlg') dlg;
    @ViewChild('dbCbo') dbCbo;

    public projectName: string;
    public dbSource: any;

    public logicalName: string;

    public datasource: string;
    public username: string;
    public password: string;
    public database: string = null;
    public jsNamespace: string = null;
    public defaulRuleMode: string = "-1";

    private authenticationType: any = 100/*Windows*/;

    private isLoadingDbList: boolean = false;
    private isTestingDbDetails: boolean = false;

    constructor() {
    }

    public show() {

        if (this.dbSource) {
            this.logicalName = this.dbSource.Name;
            this.database = this.dbSource.InitialCatalog;
            this.datasource = this.dbSource.DataSource;
            this.jsNamespace = this.dbSource.JsNamespace;
            this.defaulRuleMode = this.dbSource.DefaultRuleMode;
            this.username = this.dbSource.UserID;

            this.authenticationType = this.dbSource.IntegratedSecurity ? 100/*Windows Auth*/ : 200/*SQL login*/;

            var data = [{ id: this.dbSource.InitialCatalog, text: this.dbSource.InitialCatalog }];

            //!$(this.dbCbo.nativeElement).select2({ data: data, tags: true });
        }
        /*!!
                $(this.dlg.nativeElement).find("select").first().select2(<any>{
                    tags: true,
                    createTag: function (params) {
                        return {
                            id: params.term,
                            text: params.term,
                            newOption: true
                        }
                    }
                });
        */
        $(this.dlg.nativeElement).modal();//.validator("validate");

    }

    public close() {
        $(this.dlg.nativeElement).modal("hide").remove();
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
    }

    ngAfterViewInit() {
        this.ready.emit(null);
    }

    private onLoadDbList() {
        this.isLoadingDbList = true;


        var user = null, pass = null;

        if (this.authenticationType == 200/*SQL*/) {
            user = this.username;
            pass = this.password;
        }

        L2.fetchJson(`/api/util/listdbs?datasource=${this.datasource}&u=${L2.nullToEmpty(user)}&p=${L2.nullToEmpty(pass)}`).then((list: any) => {
            this.isLoadingDbList = false;

            var data = list.Data.map((s) => { return { id: s, text: s } });

            //!!$(this.dbCbo.nativeElement).select2({ data: data, tags: true }).select2("open");
        }).catch(() => {
            this.isLoadingDbList = false;
        });
    }


    private onAddClicked() {

        var $dlg = $(this.dlg.nativeElement);

        //$dlg.validator("validate");

        // if ($dlg.find(".has-error").length > 0 || this.defaulRuleMode == "-1") return false;

        this.database = this.dbCbo.nativeElement.value;

        if (this.dbSource) {

            L2.putJson(`/api/database/update?project=${this.projectName}&oldName=${this.dbSource.Name}&dataSource=${this.datasource}&catalog=${this.database}&username=${L2.nullToEmpty(this.username)}&password=${L2.nullToEmpty(this.password)}&jsNamespace=${L2.nullToEmpty(this.jsNamespace)}&defaultRoleMode=${this.defaulRuleMode}`
                , { body: JSON.stringify(this.logicalName) }).then(r => {
                    L2.success("Database source updated successfully");
                    this.onNewDbAdded.emit(r);
                    this.close();
                });
            return;
        }

        L2.postJson(`/api/database?project=${this.projectName}&dataSource=${this.datasource}&catalog=${this.database}&username=${L2.nullToEmpty(this.username)}&password=${L2.nullToEmpty(this.password)}&jsNamespace=${L2.nullToEmpty(this.jsNamespace)}&defaultRoleMode=${this.defaulRuleMode}`
            , { body: JSON.stringify(this.logicalName) }).then(r => {
                L2.success("New database source added successfully");
                this.onNewDbAdded.emit(r);
                this.close();
            });
    }

    private onTestConnectionClicked() {

        this.isTestingDbDetails = true;
        this.database = this.dbCbo.nativeElement.value;

        var user = null, pass = null;

        if (this.authenticationType == 200/*SQL*/) {
            user = this.username;
            pass = this.password;
        }

        L2.fetchJson(`/api/util/testconnection?dataSource=${this.datasource}&catalog=${this.database}&username=${L2.nullToEmpty(user)}&password=${L2.nullToEmpty(pass)}`).then(() => {
            this.isTestingDbDetails = false;
            L2.success("Connection successful");
        }).catch(() => this.isTestingDbDetails = false);

    }
    private shouldDisableMain(): boolean {
        return this.isTestingDbDetails;
    }

}


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
    private projectName: string;
    private dbList: any;

    public get name(): string { return this.projectName; }

    private componentState = "enterComponent";

    constructor(
        private projectService: ProjectService
        , public route: ActivatedRoute
        , private router: Router
        , private dialog: MdDialog
        , private componentFactoryResolver: ComponentFactoryResolver
        , private injector: Injector
        , private appRef: ApplicationRef
        , private viewContainerRef: ViewContainerRef
    ) {
        this.route.params.subscribe(params => {
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



    private formatDbCboItem(item) {
        if (!item.Data) return;
        return $(`<div class="databaseSourceCboItem"><div class="h">${item.text}</div><div class="line2">${item.Data.DataSource}; ${item.Data.InitialCatalog}</div></div>`);
    }

    private onAddEditDbSourceClicked(row) {
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
                    guid: row.Guid
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
                            L2.postJson(`/api/database?project=${this.projectName}&dataSource=${obj.dataSource}&catalog=${obj.database}&username=${L2.nullToEmpty(obj.username)}&password=${L2.nullToEmpty(obj.password)}&jsNamespace=${L2.nullToEmpty(null)}&defaultRoleMode=${obj.defaultRuleMode}`
                                , { body: JSON.stringify(obj.logicalName) }).then(r => {
                                    L2.success("New database source added successfully");
                                });
                        }
                        else {
                            // update
                            L2.putJson(`/api/database/update?project=${this.projectName}&oldName=${row.Name}&dataSource=${obj.dataSource}&catalog=${obj.database}&username=${L2.nullToEmpty(obj.username)}&password=${L2.nullToEmpty(obj.password)}&jsNamespace=${L2.nullToEmpty(null)}&defaultRoleMode=${obj.defaultRuleMode}`
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

    onEditDatabaseSource(db) {
        var factory = this.componentFactoryResolver.resolveComponentFactory(AddNewDatabaseSourceDialog);

        var ref = this.viewContainerRef.createComponent(factory);

        ref.instance.ready.subscribe(() => {
            ref.instance.projectName = this.projectName;
            ref.instance.dbSource = db;
            ref.instance.show();
        });

        ref.instance.onNewDbAdded.subscribe(() => { this.refreshDbList(); });

    }

    onAddNewDatabase() {
        var factory = this.componentFactoryResolver.resolveComponentFactory(AddNewDatabaseSourceDialog);
        var ref = this.viewContainerRef.createComponent(factory);

        ref.instance.ready.subscribe(() => {
            ref.instance.projectName = this.projectName;
            ref.instance.show();
        });

        ref.instance.onNewDbAdded.subscribe(() => { this.refreshDbList(); });
    }

    onDeleteDatabase(row) {
        L2.confirm(`Are you sure you want to delete the database source <strong>${row.Name}</strong>?`, "Confirm action").then(r => {
            if (r) this.deleteDatabaseSource(row.Name);
        });
    }

    private deleteDatabaseSource(name: string) {
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

