import { Component, OnInit } from '@angular/core';
import { L2 } from 'l2-lib/L2';
import { ApiService } from '~/services/api';

@Component({
  selector: 'background-threads-tab',
  templateUrl: './background-threads.component.html',
  styleUrls: ['./background-threads.component.css']
})
export class BackgroundThreadsComponent implements OnInit {

  constructor(public api: ApiService) { }

  ngOnInit() {
    try {

      this.api.app.plugins.getAllBackgroundThreads().then(r => {
        console.log("All BG Threads", r);
      });

    }
    catch (e) {
      L2.handleException(e);
    }
  }

}
