import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { L2 } from 'l2-lib/L2';


export interface IDataSource {
  logicalName?: string;
  defaultRuleMode?: string;
  guid?: string;
}

@Component({
  selector: 'app-datasource-dialog',
  templateUrl: './datasource-dialog.component.html',
  styleUrls: ['./datasource-dialog.component.css']
})
export class DatasourceDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DatasourceDialogComponent>) {

  }

  ngOnInit() { 
  }


  public obj: IDataSource = {};
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

  public get data(): IDataSource { return this.obj; }
  public set data(data: IDataSource) {
    this.obj = data;
    this.addMode = false;
  }



  public shouldDisableControls() {
    return this.isTestingConnection;
  }


}
