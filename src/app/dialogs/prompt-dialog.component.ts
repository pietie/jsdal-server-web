import { Component } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
    templateUrl: './prompt-dialog.component.html',
    styles: [`
        md-card { margin-bottom: 10px; }
        md-nav-list a[md-list-item].full-height /deep/ .md-list-item {
            height: 100%; margin-bottom: 10px;
        }
        `],

})
export class PromptDialog {

    private title: string;
    private fieldName: string;
    private val: string;
    private okayTxt: string;

    constructor(public dialogRef: MdDialogRef<PromptDialog>) {
    }

    public static prompt(dialog: MdDialog, title: string, fieldName: string, val: string, okayTxt: string = "Okay"): Promise<boolean> {

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

    private okayClicked() {
        if (!this.val || this.val == "") {
            return;
        }

        this.dialogRef.close(this.val);
    }

}
