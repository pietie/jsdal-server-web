import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IL2OutputMessageHandler } from 'l2-lib/L2';
import { Router, ActivatedRoute } from '@angular/router';
import { AccountService } from './account/account.service';

import { MsgDialog } from './dialogs/msg-dialog.component'
import { PromptDialog } from "app/dialogs";

export class L2MsgHandler implements IL2OutputMessageHandler {

    constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private router: Router, private accountService: AccountService) {


    }

    info(msg: string, title?: string): any {
        alert("X.info ... local info:" + msg);
    }

    warning(msg: string, title?: string): any {
        // incredibly crude but easiest solution for now to handle token expiration globally
        if (/your access token has expired/gi.test(msg)) { 
            //!this.securityService.logout();
            this.router.navigate(['/login']);
            return;
        }
        MsgDialog.exclamation(this.dialog, title, msg);
    }

    success(msg: string, title?: string): any {
        this.snackBar.open(msg, title, { duration: 2500 });
    }

    exclamation(msg: string, title?: string): any {
        // incredibly crude but easiest solution for now to handle token expiration globally
        if (/your access token has expired/gi.test(msg)) {
            //!this.securityService.logout();
            this.router.navigate(['/login']);
            return;
        }
        MsgDialog.exclamation(this.dialog, title, msg);
    }

    confirm(msg: string, title?: string): any {
        return MsgDialog.confirm(this.dialog, title, msg);
    }

    prompt(title?: string, fieldName?: string, val?: string, okayButtonLabel?: string): Promise<any> {
        return PromptDialog.prompt(this.dialog, title, fieldName, val, okayButtonLabel);
    }

    handleException(error: Error | ExceptionInformation | string, additionalKVs?: Object): any {
        // TODO: navigate to error page? or just show message at the top? dialog would be nice I guess
        alert("EXCEPTION ALERT (app component)" + error.toString());
        console.error(error);
    }
}