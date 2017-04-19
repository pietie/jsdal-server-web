import { Component } from '@angular/core'

@Component({
    selector: 'TablesDialog',
    template: `


    <div class="resultContainer" *ngIf="_tableKeys" style="overflow-y: scroll;height:80%;">

        <div *ngFor="let key of _tableKeys">

            <div class="panel panel-primary">
	            <div class="panel-heading">
		            <h3 class="panel-title">{{ key }}</h3>
	            </div>
	            <div class="panel-body">

                    <table class="grid">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th style="width:100px">Data type</th>
                                <th style="width:80px;">Size</th>
                                <th style="width:80px;">Precision.Scale</th>
                            </tr>
                        </thead>
                        <tbody>
                            <ng-template [ngIf]="dataContext[key]">
                                <tr *ngFor="let row of dataContext[key]">
                                    <td>{{ row.ColumnName }}</td>
                                    <td>{{ row.DbDataType }}</td>
                                    <td align="right">{{ row.ColumnSize }}</td>
                                    <td align="right">{{ row.NumericalPrecision }}.{{ row.NumericalScale }}</td>
                                </tr>
                            </ng-template>
                            <tr *ngIf="!dataContext[key] || dataContext[key].length == 0">
                                <td colspan="100">Empty result set.</td>
                            </tr>

                        </tbody>
                    </table>
			
	            </div>
            </div>

            <br/>

        </div>

    </div>



    <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
    </div>
 `,
})
export class TablesDialog {

    private _tableKeys: string[];
    private _dataContext: any;
    public get dataContext(): any { return this._dataContext; }
    public set dataContext(val: any) { this._dataContext = val; this._tableKeys = Object.keys(val); }

    constructor() {

    }
} 
