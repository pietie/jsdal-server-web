import { Component } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import * as L2 from '~/L2'

export interface IDbConnection {
    logicalName?: string;
    dataSource?: string;
    authType?: AuthenticationType;
    username?: string;
    password?: string;
    database?: string;
    guid?: string;
}


export enum AuthenticationType {
    Windows = 100,
    SQL = 200

}

@Component({
    selector: 'dbconneciton-dialog',
    templateUrl: './dbconnection.dialog.html',
})
export class DbConnectionDialogV2 {

    private obj: IDbConnection = { database: null, authType: AuthenticationType.SQL, dataSource: "172.16.1.36", logicalName: "test123", username: "iceweb", password: "1CeW3B" };
    private isTestingConnection: boolean = false;
    private isLoadingDbList: boolean = false;

    private addMode:boolean = true;

    private dbList: any[];

    public get dbConnection() { return this.obj; }
    public set dbConnection(con: IDbConnection) {
        this.obj = con;
        this.addMode = false;
        if (con.username && con.username != "")
        {
            this.obj.authType = AuthenticationType.SQL;
        }
        else
        {
            this.obj.authType = AuthenticationType.Windows;
        }
        

    }

    constructor(private dialogRef: MdDialogRef<DbConnectionDialogV2>) {

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

        L2.fetchJson(`/api/util/listdbs?datasource=${this.obj.dataSource}&u=${L2.NullToEmpty(user)}&p=${L2.NullToEmpty(pass)}`).then((list: any) => {
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

        L2.fetchJson(`/api/util/testconnection?dataSource=${this.obj.dataSource}&catalog=${this.obj.database}&username=${L2.NullToEmpty(user)}&password=${L2.NullToEmpty(pass)}`).then(() => {
            this.isTestingConnection = false;
            L2.Success("Connection successful");
        }).catch((e) => { this.isTestingConnection = false; L2.HandleException(e); });
    }

}