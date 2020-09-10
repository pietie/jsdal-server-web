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
  @Input() innerExceptionIx: number = 0;

  execTypeValues: any = Object.keys(ExecOptoionsExecType)
    .map(key => {
      let ret = {};
      ret[key] = ExecOptoionsExecType[key];
      return ret;
    })
    .reduce((a, b) => { return { ...a, ...b } });
  //.filter(value => typeof value === 'string') as string[];

  constructor(public router: Router, public activatedRoute: ActivatedRoute, public domSanitizer: DomSanitizer) { }

  ngOnInit() {
  }

  buildExecParmList(parmList: { [key: string]: string }) {
    if (!parmList || Object.keys(parmList).length == 0) return "";

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
    if (input == null) input = "(no stack trace)";
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
  Scalar = 2,
  ServerMethod = 10,
  BackgroundThread = 20
}
