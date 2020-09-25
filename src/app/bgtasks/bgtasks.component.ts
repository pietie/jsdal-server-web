import { Component, OnInit } from '@angular/core';
import { ApiService } from '~/services/api';

@Component({
  selector: 'app-bgtasks',
  templateUrl: './bgtasks.component.html',
  styleUrls: ['./bgtasks.component.css']
})
export class BgtasksComponent implements OnInit {

  constructor(public api: ApiService) {

  }

  executionsData: any;
  aggData: any;
  audit:any;

  ngOnInit() {
    this.api.bgTasks.bgtasks.getAll().then(r => {

      console.info("ABC ", r);

    });

    this.refreshX();
  }

  refreshX() {
    this.api.dataCollector.getAllDataTmp().then((r: any) => {

      console.log("AAL", r);
      this.executionsData = r.Executions;
      this.aggData = r.Agg;
      this.audit = r.Audit;
    });
  }

  clearExecutions() {
    this.api.dataCollector.clearoutExecutions().then((r: any) => {
      if (r > 0) this.refreshX();
    });
  }

}
