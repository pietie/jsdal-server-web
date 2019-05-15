import { Component, OnInit } from '@angular/core';
import { ApiService } from '~/services/api';

@Component({
  selector: 'app-top-resources',
  templateUrl: './top-resources.component.html',
  styleUrls: ['./top-resources.component.css']
})
export class TopResourcesComponent implements OnInit {

  constructor(public api: ApiService) { }

  ngOnInit() {
  }

  onMetricChanged(val: string) {
    console.info("get top resource for ... ", val);

    this.refresh();
  }

  refresh() {
    this.api.performance.getTopResources();
  }
}
