import {Component, Output, EventEmitter } from '@angular/core'
import { DomSanitizer } from "@angular/platform-browser";

enum LogEntryType {
    Info = 10,
    Warning = 20,
    Error = 30,
    Exception = 40
};


@Component({
    selector: 'LogGrid',
    inputs: ['datasource: datasource'],
    templateUrl: 'log-grid.component.html',
    styles: [`
      .msg {
          display: inline-block;
      }  

      .msg.Exception
      {
          background-color: #1E1E1E;
          padding: 13px;
          color: #FF8C8C;
          overflow-y: scroll;
          font-family: Consolas, 'Courier New', monospace;
      }

      ::ng-deep .msg .first-line
      {
          color: #fff !important;
          font-weight: bold !important;
      }

     

    `]
})

export class LogGrid {
    @Output() refresh: EventEmitter<any> = new EventEmitter();

    public selectedType: any = 0;
    public datasource: any;
    public filteredList: any;
    public LogEntryType = LogEntryType;
    public LogEntryTypeValues = Object.keys(LogEntryType).filter(v => isNaN(parseInt(v)));

    constructor(public domSanitizer: DomSanitizer)
    {

    }

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
            var selectedVal = this.selectedType; 

            if (selectedVal == 0) this.filteredList = this.datasource;
            else this.filteredList = this.datasource.filter(val=> val.Type == selectedVal);
        }, 0);
    }

    onRefreshClicked() {

        if (this.refresh != null) {
            this.refresh.emit(null);
        }
    }

    formatMessage(row:any/*msg: string*/) {
        let msg:string = row.Message;

        if (msg == null) return null;
        if (row.Type != LogEntryType.Exception) return msg;


        let st:string = row.Message;
        if (!st) return null;
        let lines = st.split('\n'); 

        if (lines.length > 0)
        {
            lines[0] = `<div class="first-line">${lines[0]}</div>`;
        }

        if (lines.length >= 1) {
            lines[1] = '<span class="first-stacktrace-line">' + lines[1] + '</span>';
        }

        return lines.join("<br/>");

        // return this.domSanitizer.bypassSecurityTrustHtml(msg.replace(/##.*##/g, (match) => {
        //     return `<span class="procName">${match.substr(2, match.length - 4)}</span>`;
        // }));

    }

    /*formatStackTrace(row:any) {
        let st:string = row.StackTrace;
        if (!st) return null;
        let lines = st.split('\n'); //st.replace(/\n/gm,"<br/>");

        if (lines.length >= 1) {
            lines[1] = '<span class="first-stacktrace-line">' + lines[1] + '</span>';
        }

        return lines.join("<br/>");
    }*/

}
