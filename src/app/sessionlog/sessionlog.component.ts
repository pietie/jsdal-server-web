import { Component  } from '@angular/core'

import { LogGrid } from './../controls/LogGrid'
import * as L2 from './../L2'

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
        L2.fetchJson(`/api/main/sessionlog`).then((r) => { this.logData = r; });
    }

}

  