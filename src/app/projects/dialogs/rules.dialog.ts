import { Component } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import L2 from 'l2-lib/L2';

export enum RuleType {
    Schema = 0,
    Specific = 1,
    Regex = 2
}

export enum RoutineIncludeExcludeInstructionSource {
    Unknown = 0,
    DatabaseMetadata = 10,
    DbSourceLevel = 20,
    JsFileLevel = 30
};


export enum DefaultRuleMode {
    Unknown = -1,
    IncludeAll = 0,
    ExcludeAll = 1
}


@Component({
    selector: 'rules-dialog',
    templateUrl: './rules.dialog.html',
    styleUrls: ['./rules.dialog.css']

})
export class RulesDialog {


    private isFilteredListLoading: boolean = false;
    private filterTxt: string;

    private ruleList: any[];
    private fullRoutineList: any[];
    private filteredRoutineList: any[];

    public projectName: string;
    public dbSource: string;
    public jsFilenameGuid: string;
    public title: string;

    private RuleTypeValues = RuleType;
    private RoutineIncludeExcludeInstructionSourceValues = RoutineIncludeExcludeInstructionSource;
    public defaultRuleMode: DefaultRuleMode | string = DefaultRuleMode.Unknown;

    private isInAddNewRuleMode: boolean = false;

    private TRUNCATE_ROUTINE_LIST_LENGTH: number = 20;
    private cutOffRoutineList: boolean = true;
    private needTruncation: boolean = false;

    private isLoadingRules: boolean = false;

    constructor(private dialogRef: MdDialogRef<RulesDialog>) {

    }

    ngOnInit() {
        this.refreshFullRoutineList();
        this.refreshRuleList();
    }

    private refreshFullRoutineList() {
        this.isFilteredListLoading = true;
        L2.fetchJson(`/api/rule/routineList?projectName=${this.projectName}&dbSource=${this.dbSource}&jsFilenameGuid=${L2.nullToEmpty(this.jsFilenameGuid)}`).then((r: any) => {
            this.isFilteredListLoading = false;
            this.fullRoutineList = this.filteredRoutineList = r.Data;

            this.refreshFilteredView(this.filterTxt);
        }).catch(() => { this.isFilteredListLoading = false; });
    }

    private refreshFilteredView(txt: string) {

        this.isFilteredListLoading = true;

        var results = this.fullRoutineList.filter((val, ix) => { return txt == null || txt == "" || val.RoutineFullName.toLowerCase().indexOf(txt.toLowerCase()) != -1; });

        this.needTruncation = results.length > this.TRUNCATE_ROUTINE_LIST_LENGTH;

        if (this.needTruncation && this.cutOffRoutineList) {
            results = results.slice(0, this.TRUNCATE_ROUTINE_LIST_LENGTH);
        }

        this.filteredRoutineList = results;


        this.isFilteredListLoading = false;
    }

    private debounceTimerId: number;
    public onFilterTextChanged(txt) {
        clearTimeout(this.debounceTimerId);
        this.debounceTimerId = window.setTimeout(() => { this.refreshFilteredView(txt); }, 300);
    }

    private refreshRuleList() {
        this.isLoadingRules = true;
        L2.fetchJson(`/api/rule/ruleList?projectName=${this.projectName}&dbSource=${this.dbSource}&jsFilenameGuid=${L2.nullToEmpty(this.jsFilenameGuid)}`).then((r: any) => {
            this.ruleList = r.Data;
            this.isLoadingRules = false;
        }).catch(e => { this.isLoadingRules = false; });
    }

    private onAddNewRuleClicked(schema, specific, regex, typeVal) {

        var value = [schema, specific, regex][typeVal];

        this.addNewRule(typeVal, value);
    }

    private addNewRule(ruleType: number, text: string) {
        var json = JSON.stringify({
            Type: ruleType,
            Text: text
        });

        L2.postJson(`/api/rule?projectName=${this.projectName}&dbSource=${this.dbSource}&jsFilenameGuid=${L2.nullToEmpty(this.jsFilenameGuid)}&json=${json}`).then(r => {
            L2.success("Rule successfully added");
            this.isInAddNewRuleMode = false;
            this.refreshRuleList();
            this.refreshFullRoutineList();
        });
    }

    private onDeleteRuleClicked(row) {

        L2.confirm(`Are you sure you want to delete the rule <strong>${row.Ix}. ${row.Description}</strong>?`).then((confirmed) => {
            if (!confirmed) return;

            L2.deleteJson(`/api/rule?projectName=${this.projectName}&dbSource=${this.dbSource}&jsFilenameGuid=${L2.nullToEmpty(this.jsFilenameGuid)}&ruleGuid=${row.Guid}`).then(() => {
                L2.success(`Rule ${row.Description} successfully deleted`);
                this.refreshRuleList();
                this.refreshFullRoutineList();
            });

        });
    }

    private onExplicitInludeOrExclude(row) {
        try {
            this.addNewRule(RuleType.Specific, row.RoutineFullName);
        }
        catch (e) {
            L2.handleException(e);
        }
    }

    public showIncludeExcludeButton(row) {
        
        if (this.defaultRuleMode == DefaultRuleMode.IncludeAll) {
            return row.Included;
        }
        else if (this.defaultRuleMode == DefaultRuleMode.ExcludeAll) {
            return row.Excluded;
        }

        return false;
    }
}