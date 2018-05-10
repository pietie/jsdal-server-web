import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, Params, PRIMARY_OUTLET } from "@angular/router";


@Component({
    templateUrl: './project-master.component.html',
    styleUrls: ['./project-master.component.css']
})
export class ProjectMasterComponent {

    constructor(public activatedRoute: ActivatedRoute,
        public router: Router) {

        //        this.breadcrumbService.init();

     
    }



}