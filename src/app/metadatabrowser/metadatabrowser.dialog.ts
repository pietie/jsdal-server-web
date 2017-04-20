// import { Component, EventEmitter, Output, ViewChild, ComponentFactoryResolver, ViewContainerRef } from '@angular/core'

// import { L2Dialog, DialogSize }  from '../controls/dialog.component'
// import { ParametersDialog }  from './parameters.dialog'
// import { TablesDialog }  from './tables.dialog'
// import { ResultsErrorDialog }  from './resulterror.dialog'

// import L2 from 'l2-lib/L2';


// @Component({
//     selector: 'metadataBrowserDialog',
//     templateUrl: './metadatabrowser.dialog.html',
//     styles: [`
//         tr.deleted {
//             color: #ff5076;
//         } 
//     `],
// })
// export class MetadataBrowserDialog {
//     @Output() ready: EventEmitter<any> = new EventEmitter();
//     @ViewChild('dlg') dlg;
     
//     public projectName: string;
//     public dbSourceName: string;

//     private filterQuery: string="";
//     private filterType: string="0";
//     private filterResults: string="0";
//     private filterIsDeleted: boolean=false;
//     private filterHasMetadata: boolean=false;

//     private isLoading: boolean;

//     private searchResults: any;
//     private totalCount: number;

//     constructor(private componentFactoryResolver: ComponentFactoryResolver, private viewContainerRef: ViewContainerRef) {
        
//     }

//     public show() {
//         try {

//             $(this.dlg.nativeElement).on('show.bs.modal', function () {
//                 $('.modal-content').css('width', "90%");
//                 $('.modal-content').css('height', "90%");
//             });

//             $(this.dlg.nativeElement).modal();
//         }
//         catch (e) {
//             L2.handleException(e);
//         }
//     }

//     public close() {
//         alert("close!!");
//         $(this.dlg.nativeElement).modal("hide").remove();
//         $('body').removeClass('modal-open');
//         $('.modal-backdrop').remove();
//     }

//     ngAfterViewInit() {
//         this.ready.emit(null);
//     }

//     private onSearchClicked() {
//         this.reloadList();
//     }

//     private reloadList() {
//         try {
//             this.isLoading = true;

//             L2.fetchJson(`api/database/cachedroutines?projectName=${this.projectName}&dbSource=${this.dbSourceName}&q=${this.filterQuery}&type=${this.filterType}&results=${this.filterResults}&hasMeta=${this.filterHasMetadata}&isDeleted=${this.filterIsDeleted}`)
//                 .then((r:any) => {
//                     this.isLoading = false;
//                     this.searchResults = r.Data.Results;
//                     this.totalCount = r.Data.TotalCount;
//                 }).catch(e => {
//                     this.isLoading = false;
//                 });

//         }
//         catch (e) {
//             L2.handleException(e);
//         } 

//     }

//     private viewParameters(row: any) {
//         if (row.Parameters && row.Parameters.length > 0) {
//             L2Dialog.modal(this.componentFactoryResolver, this.viewContainerRef, ParametersDialog, { title: `[${row.Schema}].[${row.Routine}] parameters`, dataContext: row.Parameters, size: DialogSize.small });
//         }

//     }

//     private showTableResults(row: any) {

//         if (row.ResultSetError) {
//             L2Dialog.modal(this.componentFactoryResolver, this.viewContainerRef, ResultsErrorDialog, { title: `[${row.Schema}].[${row.Routine}] error`, dataContext: row.ResultSetError });
//             return;
//         }

//         L2Dialog.modal(this.componentFactoryResolver, this.viewContainerRef, TablesDialog, { title: `[${row.Schema}].[${row.Routine}] results`, dataContext: row.ResultSetMetadata });
//     }

//     private showJsDALMetadata(row: any) {
//         alert("TODO: " + JSON.stringify(row));
//     }

//     private getResultsText(row: any) {
//         if (row == null) return "(none)";
//         if (row.ResultSetError) return "(error)";
//         if (!row.ResultSetMetadata || Object.keys(row.ResultSetMetadata).length == 0) return "(none)";

//         var len = Object.keys(row.ResultSetMetadata).length;

//         if (len == 1) return "1 table";
//         else return `${len} tables`;

//     }

    

// } 