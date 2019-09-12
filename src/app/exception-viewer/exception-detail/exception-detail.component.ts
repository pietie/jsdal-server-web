import { Component, OnInit, ViewChild, ViewContainerRef, TemplateRef, ViewRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { L2 } from 'l2-lib/L2';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '~/services/api';


@Component({
  selector: 'app-exception-detail',
  templateUrl: './exception-detail.component.html',
  styleUrls: ['./exception-detail.component.css']
})
export class ExceptionDetailComponent implements OnInit {

  isLoading: boolean = false;
  exceptionDetail: any;

  constructor(public router: Router, public activatedRoute: ActivatedRoute, public domSanitizer: DomSanitizer, public api: ApiService) { }


  @ViewChild('targetExecSql', { read: ViewContainerRef, static: false }) targetExecSql: ViewContainerRef;

  @ViewChild('tpl', { read: TemplateRef, static: false }) tpl: TemplateRef<any>;


  ngOnInit() {
    this.activatedRoute.params.subscribe(p => {
      this.loadException(p["id"], this.activatedRoute.snapshot.queryParams["parentId"]);


      // setTimeout(() => {
      //   let topEl = document.getElementById("main-sidenav");
      //   if (topEl) topEl.scrollIntoView();
      // }, 0)
    });
  }

  ngAfterViewInit(): void {


    // this.activatedRoute.params.subscribe(p => {
    //   this.loadException(p["id"]);

    //   setTimeout(() => {
    //     let topEl = document.getElementById("main-sidenav");
    //     if (topEl) topEl.scrollIntoView();
    //   }, 0)
    // });

  }


  loadException(id: string, parentId: string) {
    this.isLoading = true;

    this.api.exceptions.get(id, parentId).then(r => {
      this.isLoading = false;
      this.exceptionDetail = r;
      top.scroll(0,0)
    }).catch(e => {
      this.isLoading = false;
      L2.handleException(e);
    });

    // L2.fetchJson(`/api/exception/${id}`).then((r: any) => {
    //   this.isLoading = false;
    //   this.exceptionDetail = r.Data;

    //   // let newChild = this.tpl.createEmbeddedView(null);

    //   // this.targetExecSql.clear();
    //   // this.targetExecSql.insert(newChild);

    //   // if (window["PR"] != null) {
    //   //   setTimeout(() => {

    //   //     //exec [{{ exceptionDetail.execOptions.schema }}].[{{ exceptionDetail.execOptions.routine }}] {{ buildExecParmList(exceptionDetail.execOptions.inputParameters) }}

    //   //     //document.getElementById("execSql").innerHTML = `exec [${this.exceptionDetail.execOptions.schema}].[${this.exceptionDetail.execOptions.routine}]`;
    //   //     window["PR"].prettyPrint();
    //   //   }, 0);

    //   // }
    // }).catch(e => {
    //   this.isLoading = false;
    //   L2.handleException(e);
    // });
  }

}

