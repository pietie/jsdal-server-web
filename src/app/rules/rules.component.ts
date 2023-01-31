import { Component } from '@angular/core';
import { MMatLegacyDialog as MatDialog MMatLegacyDialogRef as MatDialogRef} from '@@angular/material/legacy-dialog;
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbsService } from '~/projects/master/breadcrumbs/breadcrumbs.service';
import { ApiService } from 'jsdal-api';
import { L2 } from 'l2-lib/L2';
import { RuleAddupdateDialogComponent } from '~/rules/dialogs/rule-addupdate-dialog.component';

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
    templateUrl: './rules.component.html',
    styleUrls: ['./rules.component.css']
})
export class RulesComponent {
    fixedSizeData = Array(10000).fill(30);
    
    projectName: string;
    appName: string;
    jsFilename: string;

    isFilteredListLoading: boolean = false;

    filterTxt: string;

    ruleList: any[];
    fullRoutineList: any[];
    filteredRoutineList: any[];

    //?title: string;

    RuleTypeValues = RuleType;
    DefaultRuleModeValues = DefaultRuleMode;

    RoutineIncludeExcludeInstructionSourceValues = RoutineIncludeExcludeInstructionSource;
    defaultRuleMode: DefaultRuleMode | string = DefaultRuleMode.Unknown;

    isInAddNewRuleMode: boolean = false;

    TRUNCATE_ROUTINE_LIST_LENGTH: number = 20;
    cutOffRoutineList: boolean = true;
    needTruncation: boolean = false;

    isLoadingRules: boolean = false;

    constructor(public route: ActivatedRoute,
        public dialog: MatDialog,
        public breadcrumb: BreadcrumbsService,
        public api: ApiService) {

    }

    ngOnInit() {
        this.route.data.subscribe((d: any) => {
            this.projectName = this.route.snapshot.params['project'];
            this.appName = this.route.snapshot.params['app'];

            this.jsFilename = this.route.snapshot.params['jsfile'];

            if (this.jsFilename) {
                this.breadcrumb.store([{ label: 'Projects', url: '/projects', params: [] }
                    , { label: this.projectName, url: `/projects/${this.projectName}`, params: [] }
                    , { label: this.appName, url: `/projects/${this.projectName}/${this.appName}`, params: [] }
                    , { label: this.jsFilename + ' rules', url: '', params: [] }
                ]);
            }
            else {

                this.breadcrumb.store([{ label: 'Projects', url: '/projects', params: [] }
                    , { label: this.projectName, url: `/projects/${this.projectName}`, params: [] }
                    , { label: this.appName, url: `/projects/${this.projectName}/${this.appName}`, params: [] }
                    , { label: "Application rules", url: '', params: [] }
                ]);

            }

            this.refreshFullRoutineList();
            this.refreshRuleList();
        });
    }


    public refreshFullRoutineList() {
        this.isFilteredListLoading = true;
        this.api.app.rules
            .getRoutineList(this.projectName, this.appName, this.jsFilename)
            .then(r => {
                
                this.isFilteredListLoading = false;
                this.fullRoutineList = this.filteredRoutineList = r.Routines;
                this.defaultRuleMode = r.DefaultRuleMode;

                this.refreshFilteredView(this.filterTxt);
            }).catch(() => { this.isFilteredListLoading = false; });
    }

    public refreshRuleList() {
        this.isLoadingRules = true;

        this.api.app.rules
            .getRuleList(this.projectName, this.appName, this.jsFilename)
            .then((r: any) => {
                this.ruleList = r;
                this.isLoadingRules = false;
            }).catch(e => { this.isLoadingRules = false; });
    }

    public refreshFilteredView(txt: string) {

        if (this.fullRoutineList == null) return;

        this.isFilteredListLoading = true;

        var results = this.fullRoutineList.filter((val, ix) => { return txt == null || txt == "" || val.RoutineFullName.toLowerCase().indexOf(txt.toLowerCase()) != -1; });

        this.needTruncation = results.length > this.TRUNCATE_ROUTINE_LIST_LENGTH;

        if (this.needTruncation && this.cutOffRoutineList) {
            results = results.slice(0, this.TRUNCATE_ROUTINE_LIST_LENGTH);
        }

        this.filteredRoutineList = results;


        this.isFilteredListLoading = false;
    }

    public debounceTimerId: number;
    public onFilterTextChanged(txt) {
        clearTimeout(this.debounceTimerId);
        this.debounceTimerId = window.setTimeout(() => { this.refreshFilteredView(txt); }, 300);
    }

    public onAddNewRuleClicked(schema, specific, regex, typeVal) {

        var value = [schema, specific, regex][typeVal];

        //this.addNewRule(typeVal, value);
    }

    addNewRule() {

        let dialogRef = this.dialog.open(RuleAddupdateDialogComponent, { minWidth: 550 });

        dialogRef.afterClosed().subscribe(r => {
            if (r) {
                if (r.Value == null || r.Value == "") {
                    L2.exclamation("Please provide a value for the new rule.");
                    return;
                }

                this.processAddNewRule(r);
            }

        });
    }

    editRule(row) {
        let dialogRef = this.dialog.open(RuleAddupdateDialogComponent, { minWidth: 550 });

        
        dialogRef.componentInstance.initEdit(row.Type, row.Description);

        dialogRef.afterClosed().subscribe(r => {
            if (r) {
                if (r.Value == null || r.Value == "") {
                    L2.exclamation("Please provide a value for the rule.");
                    return;
                }

                this.processUpdateRule(row.Id, r);
            }

        });
    }

    onDeleteRuleClicked(row) {
        L2.confirm(`Are you sure you want to delete the rule <strong>${row.Description}</strong>?`)
            .then((confirmed) => {
                if (!confirmed) return;

                this.api.app.rules
                    .deleteRule(this.projectName, this.appName, this.jsFilename, row.Id)
                    .then(() => {
                        L2.success(`Rule ${row.Description} successfully deleted`);
                        this.refreshRuleList();
                        this.refreshFullRoutineList();
                    });
            });

    }

    onExplicitInludeOrExclude(row) {
        try {
            this.processAddNewRule({ Type: RuleType.Specific, Value: row.RoutineFullName });
        }
        catch (e) {
            L2.handleException(e);
        }
    }

    private processAddNewRule(r: Object) {
        this.api.app.rules.addRule(this.projectName, this.appName, this.jsFilename, r).then(r => {
            L2.success("New rule added successfully");
            this.refreshRuleList();
            this.refreshFullRoutineList();
        });
    }

    private processUpdateRule(ruleId: string, r: Object) {
        this.api.app.rules.updateRule(this.projectName, this.appName, this.jsFilename, ruleId, r).then(r => {
            L2.success("Rule update successfully");
            this.refreshRuleList();
            this.refreshFullRoutineList();
        });
    }

    showIncludeExcludeButton(row) {

        if (this.defaultRuleMode == DefaultRuleMode.IncludeAll) {
            return row.Included;
        }
        else if (this.defaultRuleMode == DefaultRuleMode.ExcludeAll) {
            return row.Excluded;
        }

        return false;
    }


} 