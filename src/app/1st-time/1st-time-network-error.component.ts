import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirstTimeSetupCompletedService } from './../1st-time/1st-time-setup-completed.service';

@Component({
    templateUrl: './1st-time-network-error.component.html'
})
export class FirstTimeNetworkErrorComponent {
    isWorking = false;

    constructor(public router: Router, public firstTimeSetupCompletedService: FirstTimeSetupCompletedService) {

    }

    async tryAgain() {
        try {
            this.isWorking = true;
            await this.firstTimeSetupCompletedService.retry();
            this.router.navigate(['login']);
        }
        catch (e) {
            console.error(e);
        }
        finally
        {
            this.isWorking = false;
        }
    }
}