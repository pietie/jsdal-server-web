import { Injectable } from '@angular/core';
import { app } from './object-model';

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
    plugins: app.plugins
  }

  get app() {
    return this.appApi;
  }


}


