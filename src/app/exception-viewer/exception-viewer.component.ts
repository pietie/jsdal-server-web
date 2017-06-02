import { Component } from '@angular/core';
import L2 from "l2-lib/L2";
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

`

    ]
})
export class ExceptionViewerComponent {

    public exceptionDetail: any;
    public recentExceptions: any;

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
            this.recentExceptions = r.Data;
        });
    }
}