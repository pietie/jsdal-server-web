import { Component, ModuleWithProviders } from '@angular/core'
import { ActivatedRoute, Routes, RouterModule } from '@angular/router'

import { L2 } from 'l2-lib/L2';
import { ApiService } from '~/services/api';

@Component({
  selector: 'threads',
  templateUrl: 'threads.component.html'
})
export class ThreadsViewComponent {

  public threadList: any;

  constructor(public api: ApiService) {

  }

  ngOnInit() {
    this.reloadThreadList();
  }

  public reloadThreadList() {
    this.api.get('/api/threads').then((r: any) => {
      this.threadList = r.Data;
    });
  }

  public startThread(row) {
    this.api.post(`/api/threads/${row.Key}/start`).then((r) => {
      L2.success("Thread started.");
      this.reloadThreadList();
    });

  }

  public stopThread(row) {
    this.api.post(`/api/threads/${row.Key}/stop`).then((r) => {
      L2.success("Thread stopped.");
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

  public Key: string;
  public logData: any;

  constructor(public route: ActivatedRoute, public api: ApiService) {
    //this.Key = params.get("key");
    //this.router.routerState.queryParams
    this.route.params.subscribe(params => {

      this.Key = params["key"];

      this.onRefresh();
    });

  }

  public onRefresh() {
    this.api.get(`/api/threads/log/${this.Key}`).then((r: any) => { this.logData = r.Data; });
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
