import { Component  } from '@angular/core'

import L2 from 'l2-lib/L2';

@Component({
    selector: 'SessionLog',
    templateUrl: './sessionlog.component.html'
})
export class SessionLog {
    private logData: any;     

    ngOnInit() {
        this.onRefresh();

    }

    private onRefresh() {
        L2.fetchJson(`/api/main/sessionlog`).then((r:any) => { this.logData = r.Data; });
    }

}

  