import { Injectable } from '@angular/core';
import { app, appRules, serverMethods } from './object-model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() {
    //api.projects.whatever.getIt
    //app.plugins.getAll()  
    //console.log("cons", this.app);

  }

  private appApi = {
    whitelist: app.whitelist,
    plugins: app.plugins,
    jsfiles: app.jsfiles,
    rules: appRules.rules,
    serverMethods: serverMethods.serverMethods
  }

  get app() {
    return this.appApi;
  }


}


