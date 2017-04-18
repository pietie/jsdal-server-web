import { Component, EventEmitter, Output, ViewChild, ChangeDetectorRef } from '@angular/core'

import L2 from 'l2-lib/L2';

//import {DefaultRuleMode} from './../projects/dbsource.component'

enum RoutineIncludeExcludeInstructionSource {
    Unknown = 0,
    DatabaseMetadata = 10,
    DbSourceLevel = 20,
    JsFileLevel = 30
}


@Component({
    selector: 'RuleManagement',
    templateUrl: './rules.component.html',
})
export class RuleManagement {

    @Output() ready: EventEmitter<any> = new EventEmitter(); 
    @ViewChild("dlg") dlg;
    @ViewChild("newRuleDialog") newRuleDialog;

    private newTypeVal: number = 0;

    public projectName: string;
    public dbSource: string;
    public jsFilenameGuid: string;
    public title: string;

    public defaultRuleMode: any;//DefaultRuleMode|string = DefaultRuleMode.Unknown;

    private ruleList: any[];
    private fullRoutineList: any[];
    private filteredRoutineList: any[];

    private RoutineIncludeExcludeInstructionSourceValues = RoutineIncludeExcludeInstructionSource;

    private filterTxt: string; 

    private isFilteredListLoading: boolean = false;

    private isInAddNewRuleMode: boolean = false;

    private RuleTypeValues = RuleType;

    private TRUNCATE_ROUTINE_LIST_LENGTH: number = 20;
    private cutOffRoutineList: boolean = true;
    private needTruncation: boolean = false;

    constructor(private changeDetectionRef: ChangeDetectorRef) {
        
    }

    ngAfterViewInit() {
        this.ready.emit(null);
        this.changeDetectionRef.detectChanges();
    }

    public show() {
        setTimeout(() => {
            $(this.dlg.nativeElement).modal();//.validator("validate");

            this.isFilteredListLoading = true;
            this.refreshFullRoutineList();
            this.refreshRuleList();
        }, 0);
    }

    private refreshFullRoutineList() {
        L2.fetchJson(`/api/rule/routineList?projectName=${this.projectName}&dbSource=${this.dbSource}&jsFilenameGuid=${this.jsFilenameGuid}`).then((r:any)=> {
            this.isFilteredListLoading = false;
            this.fullRoutineList = this.filteredRoutineList = r.Data;
            this.refreshFilteredView(this.filterTxt);
        }).catch(() => { this.isFilteredListLoading = false; });
    }

    private refreshRuleList() {
        L2.fetchJson(`/api/rule/ruleList?projectName=${this.projectName}&dbSource=${this.dbSource}&jsFilenameGuid=${this.jsFilenameGuid}`).then((r:any)=> {
            this.ruleList = r.Data;
        });
    }

    public close() {
        $(this.dlg.nativeElement).modal("hide").remove();
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
    }


    private debounceTimerId: number;

    public onFilterTextChanged(txt) {
        clearTimeout(this.debounceTimerId);

        this.debounceTimerId = window.setTimeout(() => { this.refreshFilteredView(txt); }, 300);
    }

    private refreshFilteredView(txt: string) {
        console.info("Filter on: %s", txt);
        this.isFilteredListLoading = true;

        var results = this.fullRoutineList.filter((val, ix) => { return txt == null || txt == "" || val.RoutineFullName.toLowerCase().indexOf(txt.toLowerCase()) != -1; });

        this.needTruncation = results.length > this.TRUNCATE_ROUTINE_LIST_LENGTH;

        if (this.needTruncation && this.cutOffRoutineList) {
            results = results.slice(0, this.TRUNCATE_ROUTINE_LIST_LENGTH);
        }

        this.filteredRoutineList = results;


        this.isFilteredListLoading = false;
    }

    private onOpenAddNewRule() {
        this.isInAddNewRuleMode = true;
    }

    private onAddNewRuleClicked(a, b, c) {

        var value = [a, b, c][this.newTypeVal];

        this.addNewRule(this.newTypeVal, value);

    }

    private addNewRule(ruleType: number, text: string)
    {
        var json = JSON.stringify({
            Type: ruleType,
            Text: text
        });
        
        L2.postJson(`/api/rule?projectName=${this.projectName}&dbSource=${this.dbSource}&jsFilenameGuid=${this.jsFilenameGuid}&json=${json}`).then(r => {
            L2.success("Rule successfully added");
            this.isInAddNewRuleMode = false;
            this.refreshRuleList();
            this.refreshFullRoutineList();
        });
    }

    private onDeleteRuleClicked(row) {

        L2.confirm(`Are you sure you want to delete the rule <strong>${row.Ix}. ${row.Description}</strong>?`).then(() => {

            L2.deleteJson(`/api/rule?projectName=${this.projectName}&dbSource=${this.dbSource}&jsFilenameGuid=${this.jsFilenameGuid}&ruleGuid=${row.Guid}`).then(() => {
                L2.success(`Rule <strong>${row.Description}</strong> successfully deleted`);
                this.refreshRuleList();
                this.refreshFullRoutineList();
            });

        });
    }
     
    private onExplicitInludeOrExclude(row) { 
        try {

            this.addNewRule(RuleType.Specific, row.RoutineFullName);
        }
        catch (e) {//TODO: Error handling
            alert(e.toString());
        }
    }

    public showIncludeExcludeButton(row) {
        //  (defaultRuleMode == 'IncludeAll'? 10: 20) == ((row.Included? 20:0) + (row.Excluded? 10:0)) 

        if (this.defaultRuleMode == "IncludeAll") {

            return row.Included;

        }
        else if (this.defaultRuleMode == "ExcludeAll") {
            return row.Excluded;
        }
        
        return false;
    }

}



export enum RuleType {
    Schema = 0,
    Specific = 1,
    Regex = 2
}