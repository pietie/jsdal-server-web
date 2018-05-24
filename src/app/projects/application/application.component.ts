import { Component, ApplicationRef, Directive, Input, ComponentFactoryResolver, ViewContainerRef } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { MatDialog, MatDialogRef } from '@angular/material';

import { L2 } from 'l2-lib/L2';

import { IDBSource } from './../projects.service'


import { DatasourceDialogComponent, AuthenticationType, RulesDialog } from './../dialogs';

import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { BreadcrumbsService } from './../master/breadcrumbs/breadcrumbs.service';
import { ApiService } from 'jsdal-api';


@Component({
    selector: 'Apps',
    templateUrl: './application.component.html'
})
export class ApplicationComponent {
    public isReady: Boolean = false;
    public projectName: string;

    public dbSource: IDBSource = {};


    public execConnectionsList: any;
    public outputFileList: any;
    public outputFileBusy: boolean = false;
    public pluginList: any;

    public pluginConfigIsDirty: boolean = false;

    public summaryData: any;

    public minifiedLookup: any = {};

    public paramaterSub: any;

    public whitelist: any;
    public allowAllPrivateIPs: boolean = false;

    constructor(public route: ActivatedRoute
        , public componentFactoryResolver: ComponentFactoryResolver
        , public appRef: ApplicationRef
        , public viewContainerRef: ViewContainerRef
        , public dialog: MatDialog
        , public breadcrumb: BreadcrumbsService
        , public api: ApiService
    ) {


    }

    ngOnInit() {
        try {

            // listen and wait for the data coming in from the Resolver
            this.route.data.subscribe((d: any) => {
                this.projectName = this.route.snapshot.params['project'];
                this.dbSource = d.dbSource;

                this.breadcrumb.store([{ label: 'Projects', url: '/projects', params: [] }
                    , { label: this.projectName, url: `/projects/${this.projectName}`, params: [] }
                    , { label: this.dbSource.Name, url: `/projects/${this.projectName}/${this.dbSource.Name}`, params: [] }
                ]);

                this.isReady = true;

                this.refreshOutputFileList();
                this.refreshPluginList();
                this.refreshWhitelist();

            });

        }
        catch (e) {
            L2.handleException(e);
        }
    }

    ngOnDestroy() {
        if (this.paramaterSub != null) {
            this.paramaterSub.unsubscribe();
            this.paramaterSub = null;
        }
    }



    public refreshOutputFileList() {
        this.outputFileBusy = true;
        L2.fetchJson(`/api/database/jsFiles?projectName=${this.projectName}&dbSource=${this.dbSource.Name}`).then((r: any) => {
            this.outputFileList = r.Data;
            this.outputFileBusy = false;
        }).catch(e => {
            this.outputFileBusy = false;
        });

    }

    public refreshPluginList() {

        this.api.app.plugins.getAll(this.projectName, this.dbSource.Name).then(r => {
            this.pluginList = r;
            this.pluginConfigIsDirty = false;
        });
    }


    public refreshWhitelist() {

        this.api.app.whitelist.getAll(this.projectName, this.dbSource.Name).then(r => {
            if (r) {
                this.allowAllPrivateIPs = r.AllowAllPrivate;

                if (r.Whitelist && r.Whitelist.length > 0) {
                    this.whitelist = r.Whitelist.join('\r\n');
                }
                else {
                    this.whitelist = null;
                }
            }
        });
    }


    public onPluginInclusionChanged() {
        this.pluginConfigIsDirty = true;
    }


    public onSavePluginChangesClicked() {
        let list = this.pluginList.map((p) => { return { Guid: p.Guid, Included: p.Included } });

        this.api.app.plugins.saveConfig(this.projectName, this.dbSource.Name, list).then(() => {
            L2.success("Plugin changes saved successfully");
        });
    }

    onAddNewOutputFileClicked() {

        L2.prompt("Create new output file", "Name", null, "CREATE").then((name: string) => {
            if (name) {
                this.createNewJsOutputFile(name.trim());
            }
        });
    }

    public createNewJsOutputFile(name: string): Promise<any> {
        this.outputFileBusy = true;
        return L2.postJson(`/api/database/addJsfile?projectName=${this.projectName}&dbSource=${this.dbSource.Name}&jsFileName=${name}`).then((r) => {
            L2.success("Output file successfully created.");
            this.outputFileBusy = false;
            this.refreshOutputFileList();
        }).catch(e => { this.outputFileBusy = false; });
    }

    public onEditOutputFile(row) {
        L2.prompt("Update output file", "Name", row.Filename, "UPDATE").then((name: string) => {
            if (name) {
                this.updateOutputFileName(row.Filename, name);
            }
        });
    }

    public updateOutputFileName(oldName: string, newName: string) {
        this.outputFileBusy = true;
        return L2.putJson(`/api/database/updateJsFile?projectName=${this.projectName}&dbSource=${this.dbSource.Name}&oldName=${oldName}&newName=${newName}`).then((r) => {
            L2.success(`Output file ${newName} successfully updated.`);
            this.outputFileBusy = false;
            this.refreshOutputFileList();
        }).catch(e => this.outputFileBusy = false);
    }

    public onDeleteOutputFile(row) {
        L2.confirm(`Are you sure you want to delete the output file <strong>${row.Filename}</strong>?`, "Confirm action").then(r => {
            if (r) this.deleteOutputFile(row);
        });
    }

    public deleteOutputFile(row) {
        this.outputFileBusy = true;
        return L2.deleteJson(`/api/jsfile/${row.Guid}?projectName=${this.projectName}&dbSource=${this.dbSource.Name}`).then(r => {
            this.refreshOutputFileList();
            this.outputFileBusy = false;
            L2.success(`${row.Filename} successfully deleted`);
        }).catch(e => this.outputFileBusy = false);

    }




    public onManageRulesClicked() {

        try {

            let dialogRef = this.dialog.open(RulesDialog);

            dialogRef.componentInstance.projectName = this.projectName;
            dialogRef.componentInstance.dbSource = this.dbSource.Name;
            dialogRef.componentInstance.jsFilenameGuid = null;
            dialogRef.componentInstance.title = this.dbSource.Name;
            dialogRef.componentInstance.defaultRuleMode = this.dbSource.DefaultRuleMode;


            dialogRef.afterClosed().subscribe(r => {

            });

        }
        catch (e) {
            L2.handleException(e);
        }

    }

    public onUpdateWhitelist(textarea) {
        try {
            this.api
                .app
                .whitelist
                .save(this.projectName, this.dbSource.Name, textarea.value, this.allowAllPrivateIPs)
                .then(() => L2.success(`Whitelist updated.`));
        }
        catch (e) {
            L2.handleException(e);
        }
    }


    public onJsFileManageRulesClicked(row) {
        let dialogRef = this.dialog.open(RulesDialog);

        dialogRef.componentInstance.projectName = this.projectName;
        dialogRef.componentInstance.dbSource = this.dbSource.Name;
        dialogRef.componentInstance.jsFilenameGuid = row.Guid;
        dialogRef.componentInstance.title = row.Filename;
        dialogRef.componentInstance.defaultRuleMode = this.dbSource.DefaultRuleMode;

        dialogRef.afterClosed().subscribe(r => {

        });

        /**
                var factory = this.componentFactoryResolver.resolveComponentFactory(RuleManagement);
        
                var ref = this.viewContainerRef.createComponent(factory);
        
                ref.instance.ready.subscribe(() => {
                    ref.instance.projectName = this.projectName;
                    ref.instance.dbSource = this.dbSource.Name;
                    ref.instance.jsFilenameGuid = row.Guid;
                    ref.instance.title = row.Filename;
                    //!?ref.instance.defaultRuleMode = DefaultRuleMode[this.projectService.currentDatabaseSource.DefaultRuleMode];
                    ref.instance.show();
                });
         */
    }

    // public getLastUpdatedAge(dt) {

    //     var diffInMilliseconds = moment().diff(moment(new Date(dt)), "ms");

    //     // for usage see https://github.com/EvanHahn/HumanizeDuration.js
    //     return humanizeDuration(diffInMilliseconds, { round: true, units: ["d", "h", "m"] });
    // }



    // // public refreshDbConnectionList() {
    // //     L2.fetchJson(`/api/dbconnections?projectName=${this.projectName}&dbSourceName=${this.dbSource.Name}`).then((r: any) => {
    // //         this.execConnectionsList = (<any>r).Data;
    // //     });
    // // }


    // // public onAddEditExecConnectionClicked(row) {
    // //     try {

    // //         let dialogRef = this.dialog.open(DatasourceDialogComponent);

    // //         dialogRef.componentInstance.dataSourceMode = false;

    // //         if (row) {
    // //             dialogRef.componentInstance.data = {
    // //                 logicalName: row.Name,
    // //                 //dataSource: row.DataSource,
    // //                 //database: row.InitialCatalog,
    // //                 //username: row.UserID,
    // //                 //password: null,
    // //                 guid: row.Guid
    // //                 //port: row.port,
    // //                 //instanceName: row.instanceName
    // //             };
    // //         }


    // //         dialogRef.afterClosed().subscribe(r => {
    // //             if (r) {

    // //                 try {
    // //                     let obj = dialogRef.componentInstance.data;

    // //                     if (!row) obj.guid = null;

    // //                     // if (obj.authType == AuthenticationType.Windows) {
    // //                     //     obj.username = obj.password = null;
    // //                     // }

    // //                     L2.postJson(`/api/dbconnection?dbConnectionGuid=${L2.nullToEmpty(obj.guid)}&projectName=${this.projectName}&dbSourceName=${this.dbSource.Name}&logicalName=${obj.logicalName}`)
    // //                         .then(r => {
    // //                             this.refreshDbConnectionList();
    // //                             L2.success("New database connection added successfully.");
    // //                         });
    // //                 }
    // //                 catch (e) {
    // //                     L2.handleException(e);
    // //                 }
    // //             }
    // //         });
    // //     }
    // //     catch (e) {
    // //         L2.handleException(e);
    // //     }
    // // }

    // // public onDeleteExecConnectionClicked(row) {

    // //     L2.confirm(`Are you sure you wish to delete the execution connection <strong>${row.Name}</strong>`, "Confirm action").then(r => {
    // //         if (r) {
    // //             L2.deleteJson(`/api/dbconnection?dbConnectionGuid=${row.Guid}&projectName=${this.projectName}&dbSourceName=${this.dbSource.Name}`).then(r => {
    // //                 L2.success(`Database connection <strong>${row.Name}</strong> deleted sucessfully`);
    // //                 this.refreshDbConnectionList();
    // //             });
    // //         }
    // //     });
    // // }

}