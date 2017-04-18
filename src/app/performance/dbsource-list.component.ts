import { Component } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import L2 from 'l2-lib/L2';

@Component({
    templateUrl: 'dbsource-list.component.html'
})
export class DbSourceListComponent {


    private projectName: string;
    private dbList: any;

    constructor(private activatedRoute: ActivatedRoute) {

        this.activatedRoute.params.subscribe(params => {

            this.projectName = params["project"];
            
            this.refreshDbList();
        });

    }

    refreshDbList() {
        console.log("12345!!");
        L2.fetchJson(`/api/database?project=${this.projectName}`).then((resp: any) => {
            this.dbList = resp.Data;
        });
    }

   
}