import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
    templateUrl: './msg-dialog.component.html',
    styles: [`
        mat-card { margin-bottom: 10px; }
        mat-nav-list a[mat-list-item].full-height /deep/ .mat-list-item {
            height: 100%; margin-bottom: 10px;
        }
        `],

})
export class MsgDialog {

    public title: string;
    public msg: string;

    public type: MsgDialogType;

    constructor(public dialogRef: MatDialogRef<MsgDialog>) {


    }

    public getIcon(): string {
        switch (this.type) {
            case MsgDialogType.Exclamation:
                return "warning";
            case MsgDialogType.Confirmation:
                return "";
        }
    }

    public getOkayTxt(): string {

        if (this.type == MsgDialogType.Confirmation) return "CONFIRM";

        return "OKAY";
    }

    public static exclamation(dialog: MatDialog, title: string, message: string) {
        let ref = dialog.open(MsgDialog, { disableClose: false });

        ref.componentInstance.title = title;
        ref.componentInstance.msg = message;
        ref.componentInstance.type = MsgDialogType.Exclamation;
    }

    public static confirm(dialog: MatDialog, title: string, message: string): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            let ref = dialog.open(MsgDialog, { disableClose: false });

            ref.componentInstance.title = title;
            ref.componentInstance.msg = message;
            ref.componentInstance.type = MsgDialogType.Confirmation;

            ref.componentInstance.dialogRef.afterClosed().subscribe(n => {
                resolve(n == "OK");
            });


        });
    }

}

enum MsgDialogType {
    Exclamation = 10,
    Confirmation = 50

}
