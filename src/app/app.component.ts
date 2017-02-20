import { Component, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService }  from './account/account.service'

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    constructor(private accountService: AccountService, private router: Router, private changeDetectorRef: ChangeDetectorRef) {
        
    }

    ngOnInit() {
        this.accountService.whenLoggedIn.subscribe(loggedIn => {
            this.changeDetectorRef.detectChanges();
        });
    }
 
}