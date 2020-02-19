import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
    templateUrl: './prompt-dialog.component.html',
    styles: [`
        mat-card { margin-bottom: 10px; }
        mat-nav-list a[mat-list-item].full-height /deep/ .mat-list-item {
            height: 100%; margin-bottom: 10px;
        }
        `],

})
export class PromptDialog {

    public title: string;
    public fieldName: string;
    public val: string;
    public okayTxt: string;

    constructor(public dialogRef: MatDialogRef<PromptDialog>) {
    }

    public static prompt(dialog: MatDialog, title: string, fieldName: string, val: string, okayTxt: string = "Okay"): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            let ref = dialog.open(PromptDialog, { disableClose: false });

            ref.componentInstance.title = title;
            ref.componentInstance.fieldName = fieldName;
            ref.componentInstance.val = val;
            ref.componentInstance.okayTxt = okayTxt ? okayTxt.toUpperCase() : "OKAY";

            ref.componentInstance.dialogRef.afterClosed().subscribe(n => {
                resolve(n);
            });
        });
    }

    public okayClicked() {
        if (!this.val || this.val == "") {
            return;
        }

        this.dialogRef.close(this.val);
    }

}
