import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import L2 from 'l2-lib/L2';

import { MetadataMoreInfoDialog } from './more-info.dialog';

@Component({
    selector: 'metadata-viewer-dialog',
    templateUrl: './metadata-viewer.dialog.html',
    styleUrls: ['./metadata-viewer.dialog.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetadataViewerDialog {

    public projectName: string;
    public dbSourceName: string;

    isLoading: boolean = false;
    searchCriteria: { query?: string, routineType?: string, status?: string, hasjsDALMetadata?: boolean, isDeleted?: boolean } = { routineType: "0", status: "0" };

    searchResults: any = null;
    totalCount: number = null;

    constructor(private dialogRef: MdDialogRef<MetadataViewerDialog>, private dialog: MdDialog, private changeDetection: ChangeDetectorRef) {

    }

    onSearchClicked() {
        try {

            this.isLoading = true;

            L2.fetchJson(`/api/database/cachedroutines?projectName=${this.projectName}&dbSource=${this.dbSourceName}&q=${L2.nullToEmpty(this.searchCriteria.query)}&type=${this.searchCriteria.routineType}&results=${this.searchCriteria.status}&hasMeta=${!!this.searchCriteria.hasjsDALMetadata}&isDeleted=${!!this.searchCriteria.isDeleted}`)
                .then((r: any) => {
                    this.isLoading = false;
                    this.searchResults = r.Data.Results;
                    this.totalCount = r.Data.TotalCount;

                    this.changeDetection.detectChanges();
                }).catch(e => {
                    this.isLoading = false;
                    this.changeDetection.detectChanges();
                });

        }
        catch (e) {
            this.isLoading = false;
            this.changeDetection.detectChanges();
            L2.handleException(e);
        }
    }


    viewParameters(row: any) {
        if (row.Parameters && row.Parameters.length > 0) {

            let dlg = this.dialog.open(MetadataMoreInfoDialog);

            dlg.componentInstance.title = `[${row.Schema}].[${row.Routine}] parameters`;
            dlg.componentInstance.mode = "Parms";
            dlg.componentInstance.dataContext = row.Parameters;
        }

    }

    showTableResults(row: any) {

        let dlg = this.dialog.open(MetadataMoreInfoDialog);
        if (row.ResultSetError) {
            dlg.componentInstance.title = `[${row.Schema}].[${row.Routine}] result error`;
            dlg.componentInstance.dataContext = row.ResultSetError;
            dlg.componentInstance.mode = "ResultSetError";
            return;
        }

        dlg.componentInstance.title = `[${row.Schema}].[${row.Routine}] results`;
        dlg.componentInstance.dataContext = row.ResultSetMetadata;
        dlg.componentInstance.mode = "ResultSet";

    }

    showJsDALMetadata(row: any) {

        let dlg = this.dialog.open(MetadataMoreInfoDialog);

        dlg.componentInstance.title = `[${row.Schema}].[${row.Routine}] JsDAL metadata`;
        dlg.componentInstance.mode = "JsDALMetadata";
        dlg.componentInstance.dataContext = row.jsDALMetadata.jsDAL;


    }

    getResultsText(row: any) {
        if (row == null) return "(none)";
        if (row.ResultSetError) return "(error)";
        if (!row.ResultSetMetadata || Object.keys(row.ResultSetMetadata).length == 0) return "(none)";

        var len = Object.keys(row.ResultSetMetadata).length;

        if (len == 1) return "1 table";
        else return `${len} tables`;

    }


}