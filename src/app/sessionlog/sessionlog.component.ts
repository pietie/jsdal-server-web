import { Component  } from '@angular/core'

import { L2  } from 'l2-lib/L2';
import { ApiService } from '~/services/api';

@Component({
    selector: 'SessionLog',
    templateUrl: './sessionlog.component.html'
})
export class SessionLog {
    public logData: any;

    constructor(public api:ApiService)
    {

    }

    ngOnInit() {
        this.onRefresh();

    }

    public onRefresh() {
      this.api.get(`/api/main/sessionlog`).then((r:any) => { this.logData = r.Data; });
    }

}

