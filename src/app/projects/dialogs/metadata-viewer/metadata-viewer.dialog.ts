import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { L2  } from 'l2-lib/L2';

import { MetadataMoreInfoDialog } from './more-info.dialog';
import { EndpointDALService } from '~/projects/endpoints/endpoint-dal.service';

@Component({
    selector: 'metadata-viewer-dialog',
    templateUrl: './metadata-viewer.dialog.html',
    styleUrls: ['./metadata-viewer.dialog.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetadataViewerDialog {

    public projectName: string;
    public dbSourceName: string;
    public endpoint: string;

    isLoading: boolean = false;
    searchCriteria: { query?: string, routineType?: string, status?: string, hasjsDALMetadata?: boolean, isDeleted?: boolean } = { routineType: "0", status: "0" };

    searchResults: any = null;
    totalCount: number = null;

    constructor(public dialogRef: MatDialogRef<MetadataViewerDialog>, public dialog: MatDialog, public changeDetection: ChangeDetectorRef, public api: EndpointDALService) {

    }

    onSearchClicked() {
        try {

            this.isLoading = true;


            this.api.getCacheRoutines(this.projectName, this.dbSourceName, this.endpoint, L2.nullToEmpty(this.searchCriteria.query), this.searchCriteria.routineType
                , this.searchCriteria.status, this.searchCriteria.hasjsDALMetadata, this.searchCriteria.isDeleted)
                .then(r=>
                    {
                        this.isLoading = false;
                        this.searchResults = r.Results;
                        this.totalCount = r.TotalCount;
    
                        this.changeDetection.detectChanges();
                    })
                .catch(e => {
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

            let dlg = this.dialog.open(MetadataMoreInfoDialog, { width: "750px" });

            dlg.componentInstance.title = `[${row.Schema}].[${row.Routine}] parameters`;
            dlg.componentInstance.mode = "Parms";
            dlg.componentInstance.dataContext = row.Parameters;
        }

    }

    showTableResults(row: any, showError:boolean) {

        let dlg = this.dialog.open(MetadataMoreInfoDialog, { width: "750px" });
        
        if (showError && row.ResultSetError) {
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

        let dlg = this.dialog.open(MetadataMoreInfoDialog, { width: "750px" });

        dlg.componentInstance.title = `[${row.Schema}].[${row.Routine}] JsDAL metadata`;
        dlg.componentInstance.mode = "JsDALMetadata";
        dlg.componentInstance.dataContext = row.jsDALMetadata.jsDAL;


    }

    getResultsText(row: any) {
        if (row == null) return "(none)";
        //if (row.ResultSetError) return "(error)";
        if (!row.ResultSetMetadata || Object.keys(row.ResultSetMetadata).length == 0) return "(none)";

        var len = Object.keys(row.ResultSetMetadata).length;

        if (len == 1) return "1 table";
        else return `${len} tables`;

    }


}