import { Injectable, ApplicationRef  } from '@angular/core';
import { Location } from '@angular/common';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { FirstTimeSetupCompletedService } from './1st-time-setup-completed.service';

@Injectable()
export class FirstTimeSetupCompletedGuard implements CanActivate {
    constructor(private router: Router, private location: Location, private firstTimeSetup: FirstTimeSetupCompletedService, private appRef:ApplicationRef ) {

    }

    async canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
        try {
            let isComplete = await this.firstTimeSetup.isFirstTimeSetupComplete;

            if (isComplete === undefined) {
//this.firstTimeSetup.retry();
console.warn("isComplete is undefined");
                return false;
            }

            if (!isComplete) {
                console.log("routing!!!", isComplete);
                this.router.navigate(['/1st-time']);
            }

            return isComplete;
        }
        catch (e) {
            console.log("...network-error");
            this.appRef.tick();
            this.router.navigate(['/network-error']);
        }
    }
}
