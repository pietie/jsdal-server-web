﻿import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { L2  } from 'l2-lib/L2';

@Component({
    templateUrl: 'dbsource-list.component.html'
})
export class DbSourceListComponent {


    public projectName: string;
    public dbList: any;

    constructor(public activatedRoute: ActivatedRoute) {

        this.activatedRoute.params.subscribe(params => {

            this.projectName = params["project"];
            
            this.refreshDbList();
        });

    }

    refreshDbList() {
        L2.fetchJson(`/api/app?project=${this.projectName}`).then((resp: any) => {
            this.dbList = resp.Data;
        });
    }

   
}