import { Component } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import L2 from 'l2-lib/L2';

export interface IDataSource {
    logicalName?: string;
    dataSource?: string;
    authType?: AuthenticationType;
    username?: string;
    password?: string;
    database?: string;
    defaultRuleMode?: string;
    guid?: string;
}


export enum AuthenticationType {
    Windows = 100,
    SQL = 200

}

@Component({
    selector: 'datasource-dialog',
    templateUrl: './datasource.dialog.html',
})
export class DataSourceDialog {

    private obj: IDataSource = {}; 
    private isTestingConnection: boolean = false;
    private isLoadingDbList: boolean = false;

    private addMode:boolean = true;
    private _dataSourceMode:boolean= true;
    private _title:string;

    private dbList: any[];

    public get dataSourceMode(): boolean { return this._dataSourceMode; }
    public set dataSourceMode(b:boolean) { this._dataSourceMode = b; }

    public get title(): string { return this._title; }
    public set title(title:string) { this._title = title; }

    public get data(): IDataSource { return this.obj; }
    public set data(data: IDataSource) {
        this.obj = data;
        this.addMode = false;
        if (data.username && data.username != "")
        {
            this.obj.authType = AuthenticationType.SQL;
        }
        else
        {
            this.obj.authType = AuthenticationType.Windows;
        }
        

    }

    constructor(private dialogRef: MdDialogRef<DataSourceDialog>) {

    }

    private shouldDisableControls() {
        return this.isTestingConnection;
    }

    private loadDbList() {

        this.isLoadingDbList = true;

        let user = null, pass = null;

        if (this.obj.authType == 200/*SQL*/) {
            user = this.obj.username;
            pass = this.obj.password;
        }

        L2.fetchJson(`/api/util/listdbs?datasource=${this.obj.dataSource}&u=${L2.nullToEmpty(user)}&p=${L2.nullToEmpty(pass)}`).then((list: any) => {
            this.isLoadingDbList = false;
            this.dbList = list.Data.map((s) => { return { id: s, text: s } });
        }).catch(() => {
            this.isLoadingDbList = false;
        });
    }

    private testConnection() {
        this.isTestingConnection = true;

        let user = null, pass = null;

        if (this.obj.authType == AuthenticationType.SQL) {
            user = this.obj.username;
            pass = this.obj.password;
        }

        L2.fetchJson(`/api/util/testconnection?dataSource=${this.obj.dataSource}&catalog=${this.obj.database}&username=${L2.nullToEmpty(user)}&password=${L2.nullToEmpty(pass)}`).then(() => {
            this.isTestingConnection = false;
            L2.success("Connection successful");
        }).catch((e) => { this.isTestingConnection = false; L2.handleException(e); });
    }

}