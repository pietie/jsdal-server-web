import { Component } from '@angular/core';
import { L2 } from 'l2-lib/L2';
import { DomSanitizer } from "@angular/platform-browser";
import { Router } from '@angular/router';

@Component({
    templateUrl: './exception-viewer.component.html',
    styleUrls: ['./exception-viewer.component.css']
})
export class ExceptionViewerComponent {

    public recentExceptions: any;
    public totalExceptionCnt: number = 0;
    public appTitles: string[];

    public topN: number = 20;

    public isLoadingExceptionList: boolean = false;


    constructor(public domSanitizer: DomSanitizer, public router: Router) {
        this.loadGooglePrettyfier();
    }

    ngOnInit() {
        this.fetchRecentExceptions();
    }

    loadGooglePrettyfier()
    {
        let script = document.createElement("script");
        
        script.src = "https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js?lang=sql&skin=desert";
        document.body.appendChild(script);

    }

    lookupError(errRef: string) {
        this.router.navigate(['/exceptions/' + errRef]);
    }


    fetchRecentExceptions() {
        this.isLoadingExceptionList = true;
        L2.fetchJson(`/api/exception/top/${this.topN}`).then((r: any) => {
            this.isLoadingExceptionList = false;
            this.appTitles = ["(All)", ...<any>new Set(r.Data.Results.map(r => r.appTitle)).entries()];

            this.totalExceptionCnt = r.Data.TotalExceptionCnt;
            this.recentExceptions = r.Data.Results;//.sort((a,b)=>a.created<=b.created);
        }).catch(e => {
            this.isLoadingExceptionList = false;
            L2.handleException(e);
        });
    }

    clearAll() {
        L2.postJson('/api/exception/clear-all').then(r => {
            L2.success('Exceptions cleared.');
            this.fetchRecentExceptions();
        });
    }

    formatMessage(msg: string) {
        if (msg == null) return null;
        return this.domSanitizer.bypassSecurityTrustHtml(msg.replace(/##.*##/g, (match) => {
            return `<span class="procName">${match.substr(2, match.length - 4)}</span>`;
        }));

    }
}
