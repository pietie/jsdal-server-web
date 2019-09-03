import { Component, OnInit, ViewChild, ViewContainerRef, TemplateRef, ViewRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { L2 } from 'l2-lib/L2';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-exception-detail',
  templateUrl: './exception-detail.component.html',
  styleUrls: ['./exception-detail.component.css']
})
export class ExceptionDetailComponent implements OnInit {

  isLoading: boolean = false;
  exceptionDetail: any;

  execTypeValues: string[] = Object.keys(ExecOptoionsExecType).map(key => ExecOptoionsExecType[key]).filter(value => typeof value === 'string') as string[];

  constructor(public router: Router, public activatedRoute: ActivatedRoute, public domSanitizer: DomSanitizer) { }


  @ViewChild('targetExecSql', { read: ViewContainerRef, static: false }) targetExecSql: ViewContainerRef;

  @ViewChild('tpl', { read: TemplateRef, static: false }) tpl: TemplateRef<any>;


  ngOnInit() {
    this.activatedRoute.params.subscribe(p => {
      this.loadException(p["id"]);

      setTimeout(() => {
        let topEl = document.getElementById("main-sidenav");
        if (topEl) topEl.scrollIntoView();
      }, 0)
    });
  }

  ngAfterViewInit(): void {


    // this.activatedRoute.params.subscribe(p => {
    //   this.loadException(p["id"]);

    //   setTimeout(() => {
    //     let topEl = document.getElementById("main-sidenav");
    //     if (topEl) topEl.scrollIntoView();
    //   }, 0)
    // });

  }


  loadException(id: string) {
    this.isLoading = true;

    L2.fetchJson(`/api/exception/${id}`).then((r: any) => {
      this.isLoading = false;
      this.exceptionDetail = r.Data;

      // let newChild = this.tpl.createEmbeddedView(null);

      // this.targetExecSql.clear();
      // this.targetExecSql.insert(newChild);

      // if (window["PR"] != null) {
      //   setTimeout(() => {

      //     //exec [{{ exceptionDetail.execOptions.schema }}].[{{ exceptionDetail.execOptions.routine }}] {{ buildExecParmList(exceptionDetail.execOptions.inputParameters) }}

      //     //document.getElementById("execSql").innerHTML = `exec [${this.exceptionDetail.execOptions.schema}].[${this.exceptionDetail.execOptions.routine}]`;
      //     window["PR"].prettyPrint();
      //   }, 0);

      // }
    }).catch(e => {
      this.isLoading = false;
      L2.handleException(e);
    });
  }


  formatMessage(msg: string) {
    if (msg == null) return null;
    return this.domSanitizer.bypassSecurityTrustHtml(msg.replace(/##.*##/g, (match) => {
      return `<span class="procName">${match.substr(2, match.length - 4)}</span>`;
    }));

  }

  formatStackTrace(st: string) {
    if (!st) return null;
    let lines = st.split('\n');

    if (lines.length >= 1) {

      let r = lines.filter(v => v.trimLeft().startsWith("at jsdal_server_core"));

      if (r.length > 0) {
        let ix = lines.indexOf(r[0]);

        lines[ix] = '<span class="first-stacktrace-line">' + lines[ix] + '</span>';
      }


    }

    return lines.join("<br/>");
  }

  buildExecParmList(parmList: { [key: string]: string }) {
    if (!parmList || Object.keys(parmList).length == 0) return null;

    return Object.keys(parmList).map(k => `@${k} = ${this.wrapParmValue(parmList[k])}`).join(',\r\n\t\t');
  }

  private wrapParmValue(val: string) {
    if (val == null) return 'null';
    return `'${val}'`;
  }

  handleCodeDblClicked(pre: HTMLElement) {
    var range, selection;

    if (document.body["createTextRange"]) {
      range = document.body["createTextRange"]();
      range.moveToElementText(pre);
      range.select();
    } else if (window.getSelection) {
      selection = window.getSelection();
      range = document.createRange();
      range.selectNodeContents(pre);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  prettyPrint(input: string, lang: string) {
    if (window["PR"] == null) return null;
    return window["PR"].prettyPrintOne(input, lang, false);
  }

  prettyPrintExecSql()
  {
    if (this.exceptionDetail == null || this.exceptionDetail.execOptions == null) return null;

    //exec [{{ exceptionDetail?.execOptions?.schema }}].[{{ exceptionDetail?.execOptions?.routine }}] {{ buildExecParmList(exceptionDetail?.execOptions?.inputParameters) }}

    return this.prettyPrint(`exec [${ this.exceptionDetail.execOptions.schema }].[${ this.exceptionDetail.execOptions.routine }] ${ this.buildExecParmList(this.exceptionDetail.execOptions.inputParameters)}`, "sql");
  }
}


enum ExecOptoionsExecType {
  Query = 0,
  NonQuery = 1,
  Scalar = 2
}
