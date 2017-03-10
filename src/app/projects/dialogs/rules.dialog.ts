import { Component } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import * as L2 from '~/L2'



export enum RuleType {
    Schema = 0,
    Specific = 1,
    Regex = 2
}


@Component({
    selector: 'rules-dialog',
    templateUrl: './rules.dialog.html',
    styles: [`div.addNewRule md-radio-button { width: 90px }

    div.addNewRule div.row
    {
        display:flex;
        align-items: center;
    }

    div.addNewRule div.row md-input-container
    {
        flex: 1 1 auto;
    }
    
    `]
})
export class RulesDialog {


    private isFilteredListLoading: boolean = false;

    private ruleList: any[];
    private fullRoutineList: any[];
    private filteredRoutineList: any[];

    public projectName: string;
    public dbSource: string;
    public jsFilenameGuid: string;
    public title: string;

    private RuleTypeValues = RuleType;

    public defaultRuleMode: any;//DefaultRuleMode | string = DefaultRuleMode.Unknown;

    private isInAddNewRuleMode: boolean = false;

    constructor(private dialogRef: MdDialogRef<RulesDialog>) {

    }

    ngOnInit() {
        this.refreshFullRoutineList();
        this.refreshRuleList();
    }

    private refreshFullRoutineList() {
        L2.fetchJson(`/api/rule/routineList?projectName=${this.projectName}&dbSource=${this.dbSource}&jsFilenameGuid=${L2.NullToEmpty(this.jsFilenameGuid)}`).then((r: any) => {
            this.isFilteredListLoading = false;
            this.fullRoutineList = this.filteredRoutineList = r.Data;
            console.log("fullRoutineList", r.Data);
            //!        this.refreshFilteredView(this.filterTxt);
        }).catch(() => { this.isFilteredListLoading = false; });
    }

    private refreshRuleList() {
        L2.fetchJson(`/api/rule/ruleList?projectName=${this.projectName}&dbSource=${this.dbSource}&jsFilenameGuid=${L2.NullToEmpty(this.jsFilenameGuid)}`).then((r: any) => {
            this.ruleList = r.Data;
            console.log("RULE LIST", r.Data);
        });
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

        L2.postJson(`/api/rule?projectName=${this.projectName}&dbSource=${this.dbSource}&jsFilenameGuid=${L2.NullToEmpty(this.jsFilenameGuid)}&json=${json}`).then(r => {
            L2.Success("Rule successfully added");
            this.isInAddNewRuleMode = false;
            this.refreshRuleList();
            this.refreshFullRoutineList();
        });
    }

    private onDeleteRuleClicked(row) {

        L2.Confirm(`Are you sure you want to delete the rule <strong>${row.Ix}. ${row.Description}</strong>?`).then((confirmed) => {
            if (!confirmed) return;

            L2.deleteJson(`/api/rule?projectName=${this.projectName}&dbSource=${this.dbSource}&jsFilenameGuid=${L2.NullToEmpty(this.jsFilenameGuid)}&ruleGuid=${row.Guid}`).then(() => {
                L2.Success(`Rule ${row.Description} successfully deleted`);
                this.refreshRuleList();
                this.refreshFullRoutineList();
            });

        });
    }
}