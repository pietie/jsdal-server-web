import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from './account/account.service'
import { MdDialog, MdSnackBar } from '@angular/material';

import { MsgDialog } from './dialogs/msg-dialog.component'
import L2 from 'l2-lib/L2';
import { IL2OutputMessageHandler } from 'l2-lib/L2';
import { PromptDialog } from "app/dialogs";

// TODO: Move somewhere else
class X implements IL2OutputMessageHandler {

    constructor(private dialog: MdDialog, private snackBar: MdSnackBar, private router: Router, private accountService: AccountService) {


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


@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: [ 'app.component.css' ]
})
export class AppComponent {
    constructor(private accountService: AccountService,
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef,
        private dialog: MdDialog,
        private snackBar: MdSnackBar
    ) {

        L2.registerOutputMessageHandler(new X(this.dialog, this.snackBar, this.router, null));
    }

    ngOnInit() {
        this.accountService.whenLoggedIn.subscribe(loggedIn => {
            this.changeDetectorRef.detectChanges();
        });
    }

}