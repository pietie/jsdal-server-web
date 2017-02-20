import { Component, EventEmitter, Output, ViewChild, ChangeDetectorRef } from '@angular/core'

import * as L2 from '../L2'

enum AuthenticationType {
    Windows = 100,
    SQL = 200
    
}

@Component({
    selector: 'addNewDatabaseSourceDialog',
    inputs: ['logicalName:logicalName'],
    templateUrl: './dbconnection.dialog.html',
})
export class DbConnectionDialog { // TODO: Create dialog interface with functions like 'show/close' ???
    @Output() ready: EventEmitter<any> = new EventEmitter();
    @Output() onNewDbAdded: EventEmitter<any> = new EventEmitter();
    @ViewChild('dlg') dlg;
    @ViewChild('dbCbo') dbCbo;

    private authenticationType: any = 100/*Windows*/;

    private isLoadingDbList: boolean = false;
    private isTestingDbDetails: boolean = false;

    public projectName: string;
    public dbSourceName: string;

    public rowData: any;

    public logicalName: string;
    public datasource: string;
    public username: string;
    public password: string;
    public database: string = null;

    public guid: string;

    constructor(private changeDetectionRef: ChangeDetectorRef) {
    }

    public show() {
        try {

            if (this.rowData) {
                this.logicalName = this.rowData.Name;
                this.database = this.rowData.InitialCatalog;
                this.datasource = this.rowData.DataSource;
                this.username = this.rowData.UserID;
                this.guid = this.rowData.Guid;

                if (this.rowData.UserID == "") this.rowData.UserID = null;

                //this.authenticationType = this.rowData.UserID != null ? 200/*SQL*/ : 100/*Windows*/;
                this.authenticationType = this.rowData.IntegratedSecurity ? 100/*Windows Auth*/ : 200/*SQL login*/;
                
                var data = [{ id: this.rowData.InitialCatalog, text: this.rowData.InitialCatalog }];

                $(this.dbCbo.nativeElement).select2({ data: data, tags: true });
            }

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

            $(this.dlg.nativeElement).modal();//.validator("validate");
        }
        catch (e) {
            alert(e.toString()); // TODO: error handler?   
        }
    }
     
    public close() {
        $(this.dlg.nativeElement).modal("hide").remove();
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
    }

    ngAfterViewInit() {
        this.ready.emit(null);
        this.changeDetectionRef.detectChanges();
    }

    private onLoadDbList() {

        this.isLoadingDbList = true;

        var user = null, pass = null;

        if (this.authenticationType == 200/*SQL*/) {
            user = this.username;
            pass = this.password;
        }

        L2.fetchJson(`/api/util/listdbs?datasource=${this.datasource}&u=${L2.NullToEmpty(user)}&p=${L2.NullToEmpty(pass)}`).then((list:any) => {
            this.isLoadingDbList = false;

            var data = list.Data.map((s) => { return { id: s, text: s } });

            $(this.dbCbo.nativeElement).select2({ data: data, tags: true }).select2("open");
        }).catch(() => {
            this.isLoadingDbList = false;
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

        L2.fetchJson(`/api/util/testconnection?dataSource=${this.datasource}&catalog=${this.database}&username=${L2.NullToEmpty(user)}&password=${L2.NullToEmpty(pass)}`).then(() => {
            this.isTestingDbDetails = false;
            L2.Success("Connection successful");
        }).catch(() => this.isTestingDbDetails = false);
    }

    private shouldDisableMain(): boolean {
        return this.isTestingDbDetails;
    }

    private onAddClicked() {
        try {

            var $dlg = $(this.dlg.nativeElement);

            //!$dlg.validator("validate");

            //if ($dlg.find(".has-error").length > 0) return false;

            this.database = this.dbCbo.nativeElement.value;

            if (this.authenticationType == 100/*Windows*/) {
                this.username = null;
                this.password = null;
            }

            L2.postJson(`/api/database/dbconnection?dbConnectionGuid=${this.guid}&projectName=${this.projectName}&dbSourceName=${this.dbSourceName}&logicalName=${this.logicalName}&dataSource=${this.datasource}&catalog=${this.database}&username=${L2.NullToEmpty(this.username)}&password=${L2.NullToEmpty(this.password)}`
                /*, { body: JSON.stringify(dbConnectionGuid) }*/).then(r => {
                    this.onNewDbAdded.emit(r);
                    this.close();
                });

        }
        catch (e) {
            L2.HandleException(e);
        }
    }



}