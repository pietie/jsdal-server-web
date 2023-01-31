import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { L2 } from 'l2-lib/L2';


export interface IDbConnection {
  dataSource?: string;
  authType?: AuthenticationType;
  username?: string;
  password?: string;
  database?: string;
  port?: number;
  encrypt?: boolean;

}

export enum AuthenticationType {
  Windows = 100,
  SQL = 200
}


@Component({
  selector: 'app-connection-dialog',
  templateUrl: './connection-dialog.component.html',
  styleUrls: ['./connection-dialog.component.css']
})
export class ConnectionDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConnectionDialogComponent>) {

  }


  ngOnInit() {
  }

  public obj: IDbConnection = { port: 1433 };
  public isTestingConnection: boolean = false;
  public isLoadingDbList: boolean = false;

  public addMode: boolean = true;
  public _dataSourceMode: boolean = true;
  public _title: string;

  public dbList: any[];

  public get dataSourceMode(): boolean { return this._dataSourceMode; }
  public set dataSourceMode(b: boolean) { this._dataSourceMode = b; }

  public get title(): string { return this._title; }
  public set title(title: string) { this._title = title; }

  public get data(): IDbConnection { return this.obj; }
  public set data(data: IDbConnection) {
    this.obj = data;
    this.addMode = false;

    if (data.username && data.username != "") {
      this.obj.authType = AuthenticationType.SQL;
    }
    else {
      this.obj.authType = AuthenticationType.Windows;
    }


  }


  public shouldDisableControls() {
    return this.isTestingConnection;
  }

  public loadDbList() {

    this.isLoadingDbList = true;

    let user = null, pass = null;

    if (this.obj.authType == 200/*SQL*/) {
      user = this.obj.username;
      pass = this.obj.password;
    }

    L2.fetchJson(`/api/util/listdbs?datasource=${this.obj.dataSource}&u=${L2.nullToEmpty(user)}&p=${L2.nullToEmpty(pass)}&port=${this.obj.port}`).then((list: any) => {
      this.isLoadingDbList = false;
      this.dbList = list.Data.map((s) => { return { id: s, text: s } });
    }).catch(() => {
      this.isLoadingDbList = false;
    });
  }

  public testConnection() {
    this.isTestingConnection = true;

    let user = null, pass = null;

    if (this.obj.authType == AuthenticationType.SQL) {
      user = this.obj.username;
      pass = this.obj.password;
    }

    L2.fetchJson(`/api/util/testconnection?dataSource=${this.obj.dataSource}&catalog=${this.obj.database}&username=${L2.nullToEmpty(user)}&password=${L2.nullToEmpty(pass)}&port=${this.obj.port}`).then(() => {
      this.isTestingConnection = false;
      L2.success("Connection successful");
    }).catch((e) => { this.isTestingConnection = false; L2.handleException(e); });
  }

}
