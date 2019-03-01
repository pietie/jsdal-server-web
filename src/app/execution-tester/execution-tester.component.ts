import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '~/services/api';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap, debounceTime, tap, finalize, filter } from 'rxjs/operators';
import JSONFormatter from 'json-formatter-js';
import * as shortid from 'shortid';
import { L2 } from 'l2-lib/dist/L2';




@Component({
  selector: 'app-execution-tester',
  templateUrl: './execution-tester.component.html',
  styleUrls: ['./execution-tester.component.css']
})
export class ExecutionTesterComponent implements OnInit {

  searchForm: FormGroup;

  endpoints: any[];

  project: string;
  app: string;
  endpoint: string;
  selectedEndpointVal: string;

  isSearchingRoutine: boolean = false;
  isFetchingMetadata: boolean = false;
  routineSearchResults: any[] = null;

  isExecuting: boolean = false;
  execParameters: { [key: string]: string | { name?: string, value?: string } } = {};
  execMethod: "POST" | "GET" = "GET";
  execType: "Query" | "NonQuery" | "Scalar" = "Query";
  execIncludeServerTiming: boolean = true;

  hasResult: boolean = false;
  resultStatusCode: string;
  resultBody: string;
  resultHeaders: { [key: string]: string } = null;

  resultHeaderKeys(): string[] {
    if (this.resultHeaders == null) return null;
    return Object.keys(this.resultHeaders);
  }

  /*
  DefaultValue: null
IsOutput: false
IsResult: false
MaxLength: 4
Name: "@fff"
Precision: 10
Scale: 0
SqlDataType: "int"
  */

  /*
ColumnName: "$NA_1"
ColumnSize: 3
DataType: "System.String"
DbDataType: "varchar"
NumericalPrecision: 0
NumericalScale: 0
  */
  routineMetadata: {
    Parameters: [{ Name?: string, DefaultValue?: string, IsOuput?: boolean, IsResult?: boolean, SqlDataType?: string, IsCustom?: boolean }],
    ResultSets: { [key: string]: [{ ColumnName?: string, ColumnSize?: number, DataType?: string, DbDataType?: string, NumericalPrecision?: number, NumericalScale?: number }] }
  } = null;

  constructor(public api: ApiService, public router: Router, public activatedRoute: ActivatedRoute, private formBuilder: FormBuilder) {
    this.activatedRoute.params.subscribe(params => {
      if (params) {
        this.project = params["project"];
        this.app = params["app"];
        this.endpoint = params["endpoint"];
      }
    });


  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      userInput: new FormControl({ value: null, disabled: false }, Validators.required),
    });

    this.api.app.endpoint.getFullEndpointList().then(r => {

      this.selectedEndpointVal = null;
      this.endpoints = r;

      if (this.project && this.app && this.endpoint) {
        this.selectedEndpointVal = `${this.project}/${this.app}/${this.endpoint}`;
      }
    });

    this.searchForm
      .get('userInput')
      .valueChanges
      .pipe(
        filter((query: string) => query && query.length >= 3),
        debounceTime(300),
        tap(() => this.isSearchingRoutine = true),
        switchMap(value => this.api
          .app.endpoint
          .searchRoutine(this.project, this.app, this.endpoint, value)
          .then(res => {
            this.isSearchingRoutine = false;
            return res;
          })
          // .pipe(
          //   finalize(() => this.isSearchingRoutine = false),
          // )
        )
      )
      .subscribe(res => { this.routineSearchResults = <any>res; });
  }

  displayRoutineAutocomplete(item: any) {
    if (item != null) {
      return item;
    }
  }

  onEndpointChanged(ep) {
    if (ep == null) return;
    let params = ep.split('/');

    if (params.length == 3) {
      this.project = params[0];
      this.app = params[1];
      this.endpoint = params[2];
    }

    this.router.navigateByUrl(`/exec-test/${ep}`);
  }

  routineName_Changed() {
    //console.info("routineName_Changed");
    if (this.isFetchingMetadata) return;

    this.getRoutineMetadata();
  }

  routineResult_AutoCompleteSelected(e) {
    this.routineName_Changed();
  }

  lastMetadataSearchOn: string = null;
  getRoutineMetadata() {

    let routineNameVal: string = this.searchForm.get('userInput').value;

    if (routineNameVal == this.lastMetadataSearchOn) {
      return;
    }

    this.lastMetadataSearchOn = routineNameVal;

    this.routineMetadata = null;

    this.isFetchingMetadata = true;
    this.api.app.endpoint.getRoutineMetadata(this.project, this.app, this.endpoint, encodeURIComponent(routineNameVal))
      .then((r: any) => {
        this.isFetchingMetadata = false;
        this.execParameters = {};
        this.routineMetadata = r;

      }).catch(e => {
        this.isFetchingMetadata = false;
        console.error(e);

      });
  }

  addCustomParameter() {
    let parmName: string = shortid.generate();
    this.routineMetadata.Parameters.push({ IsCustom: true, Name: parmName });
    this.execParameters[parmName] = {};
  }

  removeParameter(p: any) {
    if (this.routineMetadata == null || this.routineMetadata.Parameters == null) return;
    let ix: number = this.routineMetadata.Parameters.indexOf(p);

    if (ix < 0) return;
    delete this.execParameters[p.Name];
    this.routineMetadata.Parameters.splice(ix, 1);
  }


  convertDateToISOWithTimeOffset(dt: Date): string { // http://usefulangle.com/post/30/javascript-get-date-time-with-offset-hours-minutes
    let timezone_offset_min: number = dt.getTimezoneOffset(),
      offset_hrs: any = parseInt(<any>Math.abs(timezone_offset_min / 60)),
      offset_min: any = Math.abs(timezone_offset_min % 60),
      timezone_standard;

    if (offset_hrs < 10) offset_hrs = '0' + offset_hrs;

    if (offset_min < 10) offset_min = '0' + offset_min;

    // Add an opposite sign to the offset
    // If offset is 0, it means timezone is UTC
    if (timezone_offset_min < 0) timezone_standard = '+' + offset_hrs + ':' + offset_min;
    else if (timezone_offset_min > 0) timezone_standard = '-' + offset_hrs + ':' + offset_min;
    else if (timezone_offset_min == 0) timezone_standard = 'Z';

    let current_date: any = dt.getDate(),
      current_month: any = dt.getMonth() + 1,
      current_year: any = dt.getFullYear(),
      current_hrs: any = dt.getHours(),
      current_mins: any = dt.getMinutes(),
      current_secs: any = dt.getSeconds(),
      current_datetime;

    // Add 0 before date, month, hrs, mins or secs if they are less than 0
    current_date = current_date < 10 ? '0' + current_date : current_date;
    current_month = current_month < 10 ? '0' + current_month : current_month;
    current_hrs = current_hrs < 10 ? '0' + current_hrs : current_hrs;
    current_mins = current_mins < 10 ? '0' + current_mins : current_mins;
    current_secs = current_secs < 10 ? '0' + current_secs : current_secs;

    return current_year + '-' + current_month + '-' + current_date + 'T' + current_hrs + ':' + current_mins + ':' + current_secs + timezone_standard;
  }


  exec() {
    try {
      this.hasResult = false;
      this.resultHeaders = this.resultBody = null;
      let routineNameVal: string = this.searchForm.get('userInput').value;

      // TODO: find a better way to get the correct Schema + RoutineName
      // lots of assumptions made here ... will need to fix later
      let elems = routineNameVal.split('.');

      let schema: string = elems[0];
      let routineName: string = elems[1];

      if (schema.startsWith('[') && schema.endsWith(']')) schema = schema.substr(1, schema.length - 2);
      if (routineName.startsWith('[') && routineName.endsWith(']')) routineName = routineName.substr(1, routineName.length - 2);

      let normalParmKeys = Object.keys(this.execParameters).filter(k => !(this.execParameters[k] instanceof Object));
      let customParmKeys = Object.keys(this.execParameters).filter(k => this.execParameters[k] instanceof Object);

      let normalParms = {};
      let customParms = {};

      normalParmKeys.forEach(k => {
        normalParms[k] = this.execParameters[k];
      });

      customParmKeys.forEach(k => {
        customParms[(<any>this.execParameters[k]).name] = (<any>this.execParameters[k]).value;
      });

      let finalParms = { ...normalParms, ...customParms };

      let execMethod = "exec";

      if (this.execType == "NonQuery") execMethod = "execnq";
      else if (this.execType == "Scalar") execMethod = "execScalar";

      let url: string = `/api/${execMethod}/${this.project}/${this.app}/${this.endpoint}/${schema}/${routineName}`;

      console.log("finalParms", finalParms);

      let fetchInit: RequestInit = {
        method: this.execMethod,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      };

      if (this.execMethod == "POST") {
        fetchInit.body = JSON.stringify(finalParms);
      }
      else {

        console.log("moment.... ", moment);
        let parmQueryStringArray: string[] = Object.keys(finalParms).map(parmName => {

          let parmValue = finalParms[parmName];

          if (parmName.startsWith('@')) parmName.substr(1, parmName.length - 1);

          // serialize Date/moment objects to ISO string format
          if (typeof (moment) != "undefined" && (<any>moment).isMoment(parmValue)) {
            parmValue = this.convertDateToISOWithTimeOffset(parmValue.toDate());
          }
          else if (parmValue instanceof Date) {
            parmValue = this.convertDateToISOWithTimeOffset(parmValue);
          }


          if (parmValue != null) {
            return encodeURIComponent(parmName) + "=" + encodeURIComponent(parmValue)
          }
          else {
            return encodeURIComponent(parmName) + "=$jsDAL$.DBNull";
          }

        });

        let parmQueryString = parmQueryStringArray.join("&");
        console.log("QS", parmQueryString);

        if (parmQueryString && parmQueryString.length > 0 && parmQueryString != "") parmQueryString = "?" + parmQueryString;
        else parmQueryString = "";

        url += parmQueryString;
      }

      // TODO: get from config
      url = "https://jsdal.europassistance.co.za" + url;

      console.info("URL   ", url);

      this.isExecuting = true;

      fetch(url)
        .then(async (r) => {
          return this.processResult(r);
        })
        .catch(e => {
          this.resultStatusCode = "(exception)"
          this.isExecuting = false;
          this.resultBody = e.toString();
          console.error("fetch failed", e);
        });
    }
    catch (e) {
      this.hasResult = true;
      this.isExecuting = false;
      L2.handleException(e);
    }
  }

  async processResult(r: Response) {
    this.hasResult = true;
    this.isExecuting = false;
    this.resultStatusCode = `${r.status} - ${r.statusText}`;

    let contentType: string = r.headers.get("content-type");

    if (contentType == null) contentType = "plain/text";

    contentType = contentType.toLowerCase();

    this.resultHeaders = {};

    r.headers.forEach((v, k) => {
      this.resultHeaders[k] = v;
    });

    if (contentType.startsWith("application/json")) {

      let json = await r.json();
      const formatter = new JSONFormatter(json);

      //console.info("REDNER        ",formatter.render());
      document.getElementById("results").appendChild(formatter.render());
      //this.resultBody = this.syntaxHighlight(json);
    }
    else {
      this.resultBody = await r.text();
    }

    console.info("fetch response", r)
  }

  //http://stackoverflow.com/a/7220510
  syntaxHighlight(json) {
    json = JSON.stringify(json, undefined, 4);
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    });
  }




}
