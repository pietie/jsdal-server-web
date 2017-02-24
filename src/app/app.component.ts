import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from './account/account.service'
import { MdDialog, MdSnackBar } from '@angular/material';

import * as L2 from '~/L2';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styles: [`/deep/ md-card { margin-bottom: 14px; }`]
})
export class AppComponent {
    constructor(private accountService: AccountService,
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef,
        private dialog: MdDialog,
        private snackBar: MdSnackBar
    ) {

        L2.Init(this.dialog, this.snackBar);
    }

    ngOnInit() {
        this.accountService.whenLoggedIn.subscribe(loggedIn => {
            this.changeDetectorRef.detectChanges();
        });
    }

}