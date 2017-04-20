import { Component } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import L2 from 'l2-lib/L2';

@Component({
    selector: 'more-info.dialog',
    templateUrl: './more-info.dialog.html'
})
export class MetadataMoreInfoDialog {

    title: string;
    dataContext: any;
    mode: "Unknown" | "Parms" | "ResultSet" | "ResultSetError" = "Unknown";
    constructor(private dialogRef: MdDialogRef<MetadataMoreInfoDialog>) {

    }


}