import { Component, OnInit } from '@angular/core';
import { L2 } from 'l2-lib//L2';
import { ApiService } from '~/services/api';


@Component({
  selector: 'inline-assemblies-tab',
  templateUrl: './inline-assemblies.component.html',
  styleUrls: ['./inline-assemblies.component.css']
})
export class InlineAssembliesComponent implements OnInit {

  assemblies;
  isWorking = false;

  constructor(public api: ApiService) {


  }

  ngOnInit(): void {
    this.refreshList();
  }

  refreshList() {
    this.isWorking = true;

    this.api.app.plugins.getInlineAssemblies()
      .then(r => {

        this.assemblies = r;
        this.isWorking = false;

      }).catch(e => {
        L2.handleException(e);
        this.isWorking = false;
      });
  }

  delete(row) {
    this.isWorking = true;

    L2.confirm(`Are you sure you want to delete the module '${row.Name}'?`, "Confirm action")
      .then(r => {
        this.isWorking = false;

        alert("TODO: Implement delete...");
        // if (r) {
        //   this.api.app.serverMethods.delete(row.Id).then(r => {
        //     L2.success("Server method deleted successfully");
        //     this.refreshList();
        //   });
        //}

      }).catch(e => {
        L2.handleException(e);
        this.isWorking = false;
      });
  }


}
