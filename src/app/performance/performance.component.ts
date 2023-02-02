import { Component } from '@angular/core'
import { L2 } from 'l2-lib/L2';

import { environment } from './../../environments/environment';
import { ApiService } from '~/services/api';
import { Params, Router, ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: 'performance.component.html',
    styleUrls: ['./performance.component.css']
})
export class PerformanceComponent {

    endpoints: any[];

    project: string;
    app: string;
    endpoint: string;
    selectedEndpointVal: string;


    constructor(public api: ApiService, public router: Router, public activatedRoute: ActivatedRoute) {

    }

    ngOnInit() {
        // this.api.app.endpoint.getFullEndpointList().then(r => {

        //     if (r) {
        //         let done = {};

        //         for (var i = 0;i<r.length;i++) {
        //             var ep = r[i];
        //             let all = `${ep.Project}/${ep.App}ALL`;

        //             if (!done[all]) {
        //                 done[all] = true;

        //                 r.splice(i, 0, { Project: ep.Project, App: ep.App, Endpoint: '(ALL)' });
        //                 i++;
        //             }
        //         }
        //     }

        //     r.splice(0, 0, { Project: '(ALL)', App: '(ALL)', Endpoint: '(ALL)' });
        //     //    r = [{ Project: '(ALL)', App: '(ALL)', Endpoint: '(ALL)' }, ...r];

        //     this.selectedEndpointVal = null;
        //     this.endpoints = r;

        //     if (this.project && this.app && this.endpoint) {
        //         this.selectedEndpointVal = `${this.project}/${this.app}/${this.endpoint}`;
        //     }
        // });
    }

    ngOnDestroy() {

    }

    onEndpointChanged(ep) {
        if (ep == null) return;

        const queryParams: Params = { ep: ep };
        this.router.navigate(
            [],
            {
              relativeTo: this.activatedRoute,
              queryParams: queryParams,
              queryParamsHandling: "merge", // remove to replace all query params by provided
            });
    }










}
