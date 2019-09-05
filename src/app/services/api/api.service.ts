import { Injectable } from '@angular/core';
import { app, appRules, serverMethods, bgTasks, performance } from './object-model';
import { exceptions } from './exceptions';
import { util } from './util';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor() {

  }

  private appApi = {
    whitelist: app.whitelist,
    plugins: app.plugins,
    jsfiles: app.jsfiles,
    rules: appRules.rules,
    endpoint: app.endpoint,
    serverMethods: serverMethods.serverMethods
  }

  get app() {
    return this.appApi;
  }

  get bgTasks() {
    return bgTasks;
  }

  get performance() {
    return performance;
  }

  get util() {
    return util;
  }

  get exceptions() {
    return exceptions;
  }

  
}


