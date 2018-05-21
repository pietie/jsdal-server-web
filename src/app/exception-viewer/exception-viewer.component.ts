import { Component } from '@angular/core';
import { L2  } from 'l2-lib/L2';
import { DomSanitizer } from "@angular/platform-browser";

@Component({
    templateUrl: './exception-viewer.component.html',
    styles: [
        `
    div.exception-detail
    {

    }

    .head
    {
        font-size:1.2em;
        font-weight:bold;
    }

    /deep/ span.first-stacktrace-line
    {
        font-weight: bold;
        color: #fff;
    }

    /deep/.procName
    {
        font-weight: bold;
        color: red;
    }

    div.exception-detail .msg
    {
      
    }

    div.exception-detail .stack
    {
        background-color: #1E1E1E;
        padding: 13px;
        color: #FF8C8C;
        overflow-y: scroll;
        font-family: Consolas, 'Courier New', monospace;
    }

    /*.exception-item:hover
    {
        background-color: #f0f0f0;
    }*/

    .app-title
    {
        color: #fff;
        background-color: #B873DD;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
        width: 130px;
        margin-right: 4px;
        padding: 3px;

        position: relative;
        top: 6px;
    }

    .msg
    {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
        width: 1200px;

        position: relative;
        top: 5px;
    }

`

    ]
})
export class ExceptionViewerComponent {

    public exceptionDetail: any;
    public recentExceptions: any;
    public totalExceptionCnt:number = 0;
    public appTitles: string[];

    constructor(public domSanitizer: DomSanitizer) {

    }

    ngOnInit() {
        this.fetchRecentExceptions();
    }

    lookupError(errRef: string) {

        L2.fetchJson(`/api/exception/${errRef}`).then((r: any) => {
            this.exceptionDetail = r.Data;
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
        let lines = st.split('\n'); //st.replace(/\n/gm,"<br/>");

        if (lines.length >= 1) {
            lines[1] = '<span class="first-stacktrace-line">' + lines[1] + '</span>';
        }

        return lines.join("<br/>");
    }

    fetchRecentExceptions() {
        L2.fetchJson(`/api/exception/top/200`).then((r: any) => {
            this.appTitles =  [ "(All)", ...<any>new Set(r.Data.Results.map(r=>r.appTitle)).entries()];

            this.totalExceptionCnt = r.Data.TotalExceptionCnt;
            this.recentExceptions = r.Data.Results;//.sort((a,b)=>a.created<=b.created);
        });
    }

    clearAll()
    {
        L2.postJson('/api/exception/clear-all').then(r=>
        {
            L2.success('Exceptions cleared.');
            this.fetchRecentExceptions();
        });
    }
}