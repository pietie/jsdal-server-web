import {Component, Output, EventEmitter } from '@angular/core'

enum LogEntryType {
    Info = 10,
    Warning = 20,
    Error = 30,
    Exception = 40
};


@Component({
    selector: 'LogGrid',
    inputs: ['datasource: datasource'],
    template: `
<div class="panel panel-primary form-inline" style="width:96%;margin:auto;">

    <div class="panel-heading">
        <button (click)="onRefreshClicked()" type="button" class="btn btn-info btn-sm form-control">Refresh</button>

        <div class="form-group">

            <label for="typeCbo">Type:</label>

            <select id="typeCbo" [(ngModel)]="selectedType"  class="form-control" (change)="updateList()">
                <option value="0" selected="true">(All)</option>
                <option *ngFor="let e of LogEntryTypeValues" value="{{LogEntryType[e]}}">{{e}}</option>
            </select>

        </div>

    </div>

    <table class="grid">
        <thead>
            <tr>
                <th style="width:50px">Time</th>
                <th>Message</th>
            </tr>
        </thead>
        <tbody>
            <tr *ngFor="let row of filteredList" title="{{row.CreateDate|fromISODateStr|date:'longDate'}}">
                <td>{{row.CreateDate|fromISODateStr|date:'HH:mm:ss'}}</td>
                <td><span style="display: inline-block;width:70px" class="label label-{{getLogEntryTypeBadgeClass(row.Type)}}">{{LogEntryType[row.Type]}}</span><span>&nbsp;&nbsp;</span>{{row.Message}}</td>
            </tr>
        </tbody>
    </table>

    <div class="panel-footer" *ngIf="datasource"><span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span>&nbsp;&nbsp;Viewing <strong *ngIf="filteredList">{{ filteredList.length }}</strong> of <strong>{{ datasource.length }}</strong></div>
</div>
`
})

export class LogGrid {
    @Output() refresh: EventEmitter<any> = new EventEmitter();

    private selectedType: any = 0;
    private datasource: any;
    private filteredList: any;
    private LogEntryType = LogEntryType;
    private LogEntryTypeValues = Object.keys(LogEntryType).filter(v => isNaN(parseInt(v)));

    ngOnInit() {

    }

    ngOnChanges() {
        this.filteredList = this.datasource;
        this.selectedType = 0;

    }

    getLogEntryTypeBadgeClass(logEntryType) {
        switch (logEntryType) {
            case LogEntryType.Info: return "info";
            case LogEntryType.Warning: return "warning";
            case LogEntryType.Error: return "danger";
            case LogEntryType.Exception: return "danger";
        }

        return "unknown";
    }

    updateList() {
        // use setTimeout to ensure this.selectedType gets updated first
        setTimeout(() => {
            var selectedVal = this.selectedType; //$("#typeCbo").val();

            if (selectedVal == 0) this.filteredList = this.datasource;
            else this.filteredList = this.datasource.filter(val=> val.Type == selectedVal);
        }, 0);
    }

    onRefreshClicked() {

        if (this.refresh != null) {
            this.refresh.emit(null);
        }
    }

}
