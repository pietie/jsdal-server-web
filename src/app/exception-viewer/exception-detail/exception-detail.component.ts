import { Component, OnInit } from '@angular/core';
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

  ngOnInit() {
    this.activatedRoute.params.subscribe(p => {
      this.loadException(p["id"]);

      setTimeout(() => {
        let topEl = document.getElementById("main-sidenav");
        if (topEl) topEl.scrollIntoView();
        console.log("topEl...", topEl);
      }, 0)
    });
  }

  loadException(id: string) {
    this.isLoading = true;

    L2.fetchJson(`/api/exception/${id}`).then((r: any) => {
      this.isLoading = false;
      this.exceptionDetail = r.Data;
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
}


enum ExecOptoionsExecType {
  Query = 0,
  NonQuery = 1,
  Scalar = 2
}
