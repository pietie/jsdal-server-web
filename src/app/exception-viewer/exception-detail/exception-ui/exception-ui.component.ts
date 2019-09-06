import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'exception-ui',
  templateUrl: './exception-ui.component.html',
  styleUrls: ['./exception-ui.component.css']
})
export class ExceptionUiComponent implements OnInit {

  @Input() exception: any = null;
  @Input() innerExceptionIx:number = 0;

  execTypeValues: string[] = Object.keys(ExecOptoionsExecType).map(key => ExecOptoionsExecType[key]).filter(value => typeof value === 'string') as string[];

  constructor(public router: Router, public activatedRoute: ActivatedRoute, public domSanitizer: DomSanitizer) { }

  ngOnInit() {
  }



  // formatMessage(msg: string) {
  //   if (msg == null) return null;
  //   return this.domSanitizer.bypassSecurityTrustHtml(msg.replace(/##.*##/g, (match) => {
  //     return `<span class="procName">${match.substr(2, match.length - 4)}</span>`;
  //   }));

  // }

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

  prettyPrintExecSql() {
    if (this.exception == null || this.exception.execOptions == null) return null;

    //exec [{{ exception?.execOptions?.schema }}].[{{ exception?.execOptions?.routine }}] {{ buildExecParmList(exception?.execOptions?.inputParameters) }}

    return this.prettyPrint(`exec [${this.exception.execOptions.schema}].[${this.exception.execOptions.routine}] ${this.buildExecParmList(this.exception.execOptions.inputParameters)}`, "sql");
  }

}


enum ExecOptoionsExecType {
  Query = 0,
  NonQuery = 1,
  Scalar = 2
}
