import { Injectable } from '@angular/core';
import { app, appRules, serverMethods, bgTasks, performance, appJsFiles } from './object-model';

import { exceptions } from './exceptions';
import { dataCollector } from './datacollector';
import { health } from './health';
import { util } from './util';
import { blobs } from './blobs'

import { L2 } from 'l2-lib/L2';
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  jsDALConfig$ = fetch('jsdal.json')
    .then(r => r.json())
    .then(r => {
      this._apiBaseUrl = r.apiBaseUrl;

      this.appApi.whitelist.apiBaseUrl =
      this.appApi.plugins.apiBaseUrl =
      this.appApi.jsfiles.apiBaseUrl =
      this.appApi.rules.apiBaseUrl =
      this.appApi.endpoint.apiBaseUrl =
      this.appApi.serverMethods.apiBaseUrl =
      this.appApi.policies.apiBaseUrl =
      bgTasks.bgtasks.apiBaseUrl =
      performance.apiBaseUrl =
      util.apiBaseUrl =
      exceptions.apiBaseUrl =
      blobs.apiBaseUrl =
      dataCollector.apiBaseUrl =
      health.apiBaseUrl =
      this._apiBaseUrl;

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
    jsfiles: appJsFiles.jsfiles,
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

  get(url: string) {
    return L2.fetchJson(this.apiBaseUrl + url);
  }

  post(url: string, init: RequestInit = null) {
    return L2.postJson(this.apiBaseUrl + url, init);
  }

  put(url: string, init: RequestInit = null) {
    return L2.putJson(this.apiBaseUrl + url, init);
  }

  del(url: string, init: RequestInit = null) {
    return L2.deleteJson(this.apiBaseUrl + url, init);
  }
}


