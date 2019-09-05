import { Component, ChangeDetectorRef } from '@angular/core';
import { L2 } from 'l2-lib/L2';
import { DomSanitizer } from "@angular/platform-browser";
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '~/services/api';
import { MatOption } from '@angular/material';

@Component({
    templateUrl: './exception-viewer.component.html',
    styleUrls: ['./exception-viewer.component.css']
})
export class ExceptionViewerComponent {

    public recentExceptions: any;
    public totalExceptionCnt: number = 0;


    appTitles$: Promise<string[]>;
    endpoints$: Promise<string[]>;

    filter: { top?: number, app?: string[], endpoint?: string[], routine?: string } = { top: 20, app: ["all"], endpoint: ["all"] };

    lastFilter = null;

    isNavigatingToChild: boolean = false;

    public isLoadingExceptionList: boolean = false;


    constructor(public domSanitizer: DomSanitizer, public router: Router, public activatedRoute: ActivatedRoute, public api: ApiService, public cdr: ChangeDetectorRef) {
        this.loadGooglePrettyfier();

        this.appTitles$ = this.api.exceptions.getAppTitles();//.then(r => ["(All)", ...r]);
        this.endpoints$ = this.api.exceptions.getEndpoints();//.then(r => ["(All)", ...r]);

    }

    ngOnInit() {

        // this.router.events.subscribe(ev => {
        //     console.info("%crouter event", "font-weight:bold;font-size:1.1em;color: #333", ev);
        // });

        this.activatedRoute.queryParams.subscribe(qs => {
            console.info("qs change", qs, this.activatedRoute);

            if (this.isNavigatingToChild) return;

            if (Object.keys(qs).length == 0) {
                this.handleFilterChanged(null);
                return;
            }

            if (qs["top"]) this.filter.top = parseInt(qs["top"]);
            else this.filter.top = 20;

            if (qs["app"]) {
                if (qs["app"] instanceof Array) this.filter.app = qs["app"];
                else this.filter.app = [qs["app"]];
            }
            else {
                this.filter.app = ["all"];
            }

            if (qs["endpoint"]) {
                if (qs["endpoint"] instanceof Array) this.filter.endpoint = qs["endpoint"];
                else this.filter.endpoint = [qs["endpoint"]];
            }
            else {
                this.filter.endpoint = ["all"];
            }

            if (qs["routine"]) this.filter.routine = qs["routine"];
            else this.filter.routine = null;

            //console.info("filter1==>\t", this.filter);
            this.refreshExceptionList();
            //console.info("filter2==>\t", this.filter);


        });
    }



    loadGooglePrettyfier() {
        let script = document.createElement("script");

        script.src = "https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js?lang=sql&skin=desert";
        document.body.appendChild(script);

    }

    lookupError(errRef: string) {
        this.isNavigatingToChild = true;
        this.router.navigate(['/exceptions/' + errRef], { queryParamsHandling: "merge" })
            .then(r => {
                this.isNavigatingToChild = false;
            });
    }


    handleFilterChanged(ev: Event = null) {
        // if (ev.preventDefault) ev.preventDefault();
        // if (ev.stopPropagation) ev.stopPropagation();
        // if (ev.stopImmediatePropagation) ev.stopImmediatePropagation();

        console.info("\t\thandleFilterChanged called!", this.filter, this.activatedRoute.snapshot, this.router.url);

        if (this.filter.endpoint.length == 0) this.filter.endpoint = ["all"];
        if (this.filter.app.length == 0) this.filter.app = ["all"];

        if (this.filter.routine && this.filter.routine.trim() == "") delete this.filter.routine;

        // stay in place
        this.router.navigate([], {
            queryParams: this.filter, relativeTo: this.activatedRoute
        });


    }

    allOptionChanged(option: MatOption, propName: string) {
        //console.log("f1", this.filter[propName]);
        if (option.selected && this.filter[propName].length > 1 && option.value == "all") {
            this.filter[propName] = ["all"];
            this.cdr.detectChanges();
        }
        //console.log("f2", this.filter[propName]);
    }



    refreshExceptionList() {
        if (JSON.stringify(this.lastFilter) == JSON.stringify(this.filter)) {
            //console.info("BAIL last=", this.lastFilter, "; filter=", this.filter);
            return;
        }
        
        this.isLoadingExceptionList = true;

        this.appTitles$ = this.api.exceptions.getAppTitles();//.then(r => ["(All)", ...r]);
        this.endpoints$ = this.api.exceptions.getEndpoints();//.then(r => ["(All)", ...r]);

        let searchWithFilter = { ...this.filter };

        this.api.exceptions.getRecent(searchWithFilter)
            .then(r => {
                this.lastFilter = searchWithFilter;
                this.isLoadingExceptionList = false;

                this.totalExceptionCnt = r.TotalExceptionCnt;
                this.recentExceptions = r.Results;//.sort((a,b)=>a.created<=b.created);    
            }).catch(e => {
                this.isLoadingExceptionList = false;
                L2.handleException(e);
            });

    }

    clearAll() {
        L2.postJson('/api/exception/clear-all').then(r => {
            L2.success('Exceptions cleared.');
            this.refreshExceptionList();
        });
    }

    formatMessage(msg: string) {
        if (msg == null) return null;
        return this.domSanitizer.bypassSecurityTrustHtml(msg.replace(/##.*##/g, (match) => {
            return `<span class="procName">${match.substr(2, match.length - 4)}</span>`;
        }));

    }
}
