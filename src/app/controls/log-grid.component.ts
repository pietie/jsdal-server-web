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
    templateUrl: 'log-grid.component.html'
})

export class LogGrid {
    @Output() refresh: EventEmitter<any> = new EventEmitter();

    public selectedType: any = 0;
    public datasource: any;
    public filteredList: any;
    public LogEntryType = LogEntryType;
    public LogEntryTypeValues = Object.keys(LogEntryType).filter(v => isNaN(parseInt(v)));

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

}
