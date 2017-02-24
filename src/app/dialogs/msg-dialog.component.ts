import { Component } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

@Component({
    templateUrl: './msg-dialog.component.html',
    styles: [`
        md-card { margin-bottom: 10px; }
        md-nav-list a[md-list-item].full-height /deep/ .md-list-item {
            height: 100%; margin-bottom: 10px;
        }
        `],

})
export class MsgDialog {

    private title: string;
    private msg: string;

    private type: MsgDialogType;

    constructor(public dialogRef: MdDialogRef<MsgDialog>) {


    }

    private getIcon(): string {
        switch (this.type) {
            case MsgDialogType.Exclamation:
                return "warning";
            case MsgDialogType.Confirmation:
                return "";
        }
    }

    private getOkayTxt(): string {

        if (this.type == MsgDialogType.Confirmation) return "CONFIRM";

        return "OKAY";
    }

    public static exclamation(dialog: MdDialog, title: string, message: string) {
        let ref = dialog.open(MsgDialog, { disableClose: false });

        ref.componentInstance.title = title;
        ref.componentInstance.msg = message;
        ref.componentInstance.type = MsgDialogType.Exclamation;
    }

    public static confirm(dialog: MdDialog, title: string, message: string): Promise<boolean> {

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
