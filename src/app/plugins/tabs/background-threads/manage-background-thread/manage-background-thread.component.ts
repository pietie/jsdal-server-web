import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '~/services/api';
import { config } from 'rxjs';

@Component({
  templateUrl: './manage-background-thread.component.html',
  styleUrls: ['./manage-background-thread.component.css']
})
export class ManageBackgroundThreadComponent implements OnInit {

  public _pluginGuid: string;
  public _configs: any;
  
  constructor(public api: ApiService, public activateRoute: ActivatedRoute) {
    this.activateRoute.params.subscribe(params => {
      this._pluginGuid = params["id"];
      this.refreshConfigs();
    });
  }

  ngOnInit() {

  }

  refreshConfigs() {
    this.api.app.plugins
      .getBgThreadAllConfigs(this._pluginGuid)
      .then(configs => {
        this._configs = configs;

        console.info(configs);
      });
  }

  getActiveAppInstances(): string[] {
    if (this._configs == null) return null;
    
    // return those keys(Project/App identifiers) that have at least one child instance item(endpoint) with Display = true
    return Object.keys(this._configs.Instances).filter(k=>this._configs.Instances[k].filter(inst=>inst.Display).length > 0);
  }

}
