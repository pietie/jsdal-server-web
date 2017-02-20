import { Component } from '@angular/core'

@Component({
    selector: 'ResultsErrorDialog',
    template: `


    <textarea [(ngModel)]="dataContext" [readonly]="true" style="font-size: 12px; width:95%;margin:auto;height: 60%;">
    </textarea>


    <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
    </div>
 `,
})
export class ResultsErrorDialog {

    private _dataContext: any;
    public get dataContext(): any { return this._dataContext; }
    public set dataContext(val: any) { this._dataContext = val; }

    constructor() {

    }
} 
