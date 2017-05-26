import { Component } from '@angular/core';
import L2 from 'l2-lib/L2';

@Component({
    templateUrl: './workers.component.html'
})
export class WorkersComponent
{
    public workerList: any[];

    ngOnInit() {
        this.reloadWorkersList();
    }

    private reloadWorkersList()
    {
         L2.fetchJson(`/api/workers`).then((r: any) => {
            this.workerList = r.Data;
        });
    }
    
}