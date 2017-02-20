import { Component, ModuleWithProviders } from '@angular/core'
import { ActivatedRoute, Routes, RouterModule } from '@angular/router'

import * as L2 from '../L2'

@Component({
    selector: 'threads',
    templateUrl: 'threads.component.html'
})
export class ThreadsViewComponent {

    private threadList: any;

    constructor() {

    }

    ngOnInit() {
        this.reloadThreadList();
    }

    private reloadThreadList() {
        L2.fetchJson("/api/threads").then((r: any) => {
            this.threadList = r.Data;
        });
    }

    private startThread(row) {
        L2.postJson(`/api/threads/${row.Key}/start`).then((r) => {
            L2.Success("Thread started.");
            this.reloadThreadList();
        });
        
    }

    private stopThread(row) {
        L2.postJson(`/api/threads/${row.Key}/stop`).then((r) => {
            L2.Success("Thread stopped.");
            this.reloadThreadList();
        });

    }
} 

@Component({
    selector: 'threadLog',
    template: `
    <h3>Thread log</h3>
    <LogGrid [datasource]="logData" (refresh)="onRefresh()"></LogGrid>
`
})
export class ThreadLogComponent {

    private Key: string;
    private logData: any;

    constructor(private route: ActivatedRoute) {
        //this.Key = params.get("key");
        //this.router.routerState.queryParams
        this.route.params.subscribe(params => {
             
            this.Key = params["key"];

            this.onRefresh();
        });

    }

    private onRefresh() {
        L2.fetchJson(`/api/threads/log/${this.Key}`).then((r:any) => { this.logData = r.Data; });
    }

    ngOnInit() {
        
    }

}

//export const threadsRouting: ModuleWithProviders = RouterModule.forChild([
//    {
//        path: 'threads',
//        component: ThreadsViewComponent,
//        //children: [
//        //    {
//        //        path: '',
//        //        component: ThreadsViewComponent,
//        //        children: [
//        //            { path: '' },
//        //            { path: 'log', component: ThreadLogComponent }
//        //        ]
//        //    },
            
//        //]
//    }
//]);