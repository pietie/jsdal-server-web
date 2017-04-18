import { Component  } from '@angular/core';

import L2 from 'l2-lib/L2';

@Component({
    selector: 'home',
    templateUrl: './home.component.html'
})
export class HomeComponent {

    private statsData: any = null;

    ngOnInit() {
        console.log('home.component :: ngOnInit');
        L2.fetchJson('/api/main/stats').then((r: any) => { this.statsData = r.Data; });
    }

    private getWebServerAge(startedDate) {

        var diffInMilliseconds = moment().diff(moment(new Date(startedDate)), "ms");

        // for usage see https://github.com/EvanHahn/HumanizeDuration.js
        return humanizeDuration(diffInMilliseconds, { round: true, units: ["d", "h", "m"] });
    }

}
