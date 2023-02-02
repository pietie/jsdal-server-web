import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { L2 } from 'l2-lib/L2';
import { ApiService } from '~/services/api';

@Component({
  templateUrl: './worker-detail.component.html'
})
export class WorkerDetailComponent {
  public id: string;
  public data: any;

  constructor(public activatedRoute: ActivatedRoute, public router: Router, public api: ApiService) {
    this.activatedRoute.params.subscribe(parms => {
      this.id = parms["id"];
      this.onRefresh();
    });
  }

  public onRefresh() {
    this.api.get(`/api/workers/${this.id}`).then((r: any) => {
      this.data = r.Data;
    });
  }
}
