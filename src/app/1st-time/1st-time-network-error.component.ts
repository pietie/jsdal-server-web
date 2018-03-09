import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirstTimeSetupCompletedService } from './../1st-time/1st-time-setup-completed.service';

@Component({
    templateUrl: './1st-time-network-error.component.html'
})
export class FirstTimeNetworkErrorComponent {
    constructor(public router: Router, public firstTimeSetupCompletedService: FirstTimeSetupCompletedService) {

    }

    async tryAgain() {
        try {
            console.log("trying again...");
            await this.firstTimeSetupCompletedService.retry();
            this.router.navigate(['login']);
        }
        catch (e) {
            console.log("error");
            console.error(e);
        }
    }
}