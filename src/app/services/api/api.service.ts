import { Injectable } from '@angular/core';
import { app, appRules, serverMethods, bgTasks, performance } from './object-model';
import { exceptions } from './exceptions';
import { dataCollector } from './datacollector';
import { health } from './health';
import { util } from './util';
import { blobs } from './blobs'

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  jsDALConfig$ = fetch('jsdal.json')
    .then(r => r.json())
    .then(r => {
      this._apiBaseUrl = r.apiBaseUrl;
      return r;
    })
    .catch(ex => console.error("Failed to load jsdal.json", ex));

  constructor() {

  }


  private _apiBaseUrl: string;

  public get apiBaseUrl(): string {
    return this._apiBaseUrl;
  }

  private appApi = {
    whitelist: app.whitelist,
    plugins: app.plugins,
    jsfiles: app.jsfiles,
    rules: appRules.rules,
    endpoint: app.endpoint,
    serverMethods: serverMethods.serverMethods,
    policies: app.policies
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

  get blobs() {
    return blobs;
  }

  get dataCollector() {
    return dataCollector;
  }

  get health() {
    return health;
  }
}


