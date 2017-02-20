import { Component } from '@angular/core'
import { Router, CanDeactivate, ActivatedRoute } from '@angular/router'

import { AccountService }   from '../account/account.service';
import * as L2 from '../L2'

class ParamsType {
    access_token: string;
    token_type: string;
    expires_in: number;
    id_token: string;

    scope: string;
    state: string;
    session_state: string;
    expiresBy: Date;
}

@Component({
    selector: 'logged-in',
    template: `TODO: Redirect to home or show error possible?`,

})
export class LoggedInComponent {
    constructor(private activatedRoute: ActivatedRoute, private accountService: AccountService, private router: Router) {

        this.activatedRoute.queryParams.subscribe((params: ParamsType) => {
            
            this.accountService.updateFromWinAuth(params);
            console.log("going home....");
            this.router.navigate(['/home']);
        });
    }


}