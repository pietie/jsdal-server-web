import { Component, OnInit } from '@angular/core';
import { L2 } from 'l2-lib/L2';
import { ApiService } from '~/services/api';

@Component({
  selector: 'app-routine-list',
  templateUrl: './routine-list.component.html',
  styleUrls: ['./routine-list.component.css']
})
export class RoutineListComponent implements OnInit {

  constructor(public api: ApiService) { }
  totalCountDB: { Payload: any[], FetchTimeInMs: number };
  entryCount: number;
  isLoading: boolean;

  topN: number = 20;
  sortOn: { column: string, asc: boolean } = null;

  async ngOnInit() {
    //! this.refresh();

    this.refreshEntryCount();
  }

  async refreshEntryCount() {
    this.entryCount = await this.api.performance.getStatsTotalsEntryCount();
  }

  async refresh() {
    try {
      this.isLoading = true;
      this.refreshEntryCount();
      this.totalCountDB = await this.api.performance.getStatsTotalCounts(this.topN);

      this.totalCountDB.Payload.forEach(row => { row.AvgDurationMS = (row.TotalDurationSec / row.ExecutionCount) * 1000.0; row.AvgRows = row.TotalRows / row.ExecutionCount; });

      this.isLoading = false;
    }
    catch (ex) {
      this.isLoading = false;
    }
  }

  sort(prop) {
    if (!this.totalCountDB) return;

    if (this.sortOn && this.sortOn.column == prop) this.sortOn.asc = !this.sortOn.asc;
    else this.sortOn = { column: prop, asc: true }

    if (this.sortOn.asc) this.totalCountDB.Payload.sort((a, b) => a[prop] - b[prop]);
    else this.totalCountDB.Payload.sort((a, b) => b[prop] - a[prop]);


  }

}
