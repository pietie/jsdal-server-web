import { Component, OnInit } from '@angular/core';
import { L2 } from 'l2-lib/L2';
import { ApiService } from '~/services/api';

@Component({
  templateUrl: './uptime-history-dialog.component.html',
  styleUrls: ['./uptime-history-dialog.component.css']
})
export class UptimeHistoryDialogComponent implements OnInit {

  isLoading: boolean = true;
  data;
  constructor(public api: ApiService) {

  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.isLoading = true;

    this.api.util.getUptimeHistory().then(r => {
      this.isLoading = false;
      this.data = r;

    }).catch(e => {
      this.isLoading = false;
      L2.handleException(e);
    });
  }

}
