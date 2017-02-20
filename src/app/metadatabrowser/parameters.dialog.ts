import { Component } from '@angular/core'

@Component({
    selector: 'ParametersDialog',
    template: `

        <table class="table table-striped table-condensed">
            <thead>
                <tr>
                    <th>Name</th>
                    <th style="width:80px">Direction</th>
                    <th style="width:100px">Data type</th>
                    <th style="width:80px">Length</th>
                    <th>Default value</th>
                </tr>
            </thead>
            <tbody>
                <template [ngIf]="dataContext">
                    <tr *ngFor="let row of dataContext">
                        <td>
                            {{ row.ParameterName }}
                        </td>
                        <td>{{ row.ParameterMode }}</td>
                        <td>{{ row.DataType }}</td>
                        <td>
                            {{ row.Length }}
                        </td>
                        <td>
                            {{ row.DefaultValue }}
                        </td>
                    </tr>
                </template>
                <tr *ngIf="!dataContext || dataContext.length == 0">
                    <td colspan="100">No or empty data context set.</td>
                </tr>

            </tbody>
        </table>



    <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
    </div>
 `,
})
export class ParametersDialog {

    private _dataContext: any;
    public get dataContext(): any { return this._dataContext; }
    public set dataContext(val: any) { this._dataContext = val; }

    constructor() {

    }
} 
