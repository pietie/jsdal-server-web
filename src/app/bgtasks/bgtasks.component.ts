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

  ngOnInit() {
    this.api.bgTasks.bgtasks.getAll().then(r=>{

        console.info("ABC ", r);

    });
  }

}
