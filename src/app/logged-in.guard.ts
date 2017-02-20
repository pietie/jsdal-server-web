import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AccountService } from './account/account.service';

@Injectable()
export class LoggedInGuard implements CanActivate {
    constructor(private account: AccountService, private router: Router, private location: Location) { }

    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // TODO: Check JWT toke validity?
        if (this.account.isLoggedIn) return true;

        this.router.navigate(['/login'], { queryParams: { ref: this.location.path(false) } });
        return false;
    }
}