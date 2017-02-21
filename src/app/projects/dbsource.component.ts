import { Component, ApplicationRef, Directive, Input, ComponentFactoryResolver, ViewContainerRef } from '@angular/core'
import { ActivatedRoute } from '@angular/router'

import * as L2 from '../L2'
//?import { ProjectService } from '../projects.service'
import { ProjectComponent } from './project.component'
import { RuleManagement } from '../rules/rules.component'
import { DbConnectionDialog } from './dbconnection.dialog'
import { MetadataBrowserDialog } from '../metadatabrowser/metadatabrowser.dialog'



export enum DefaultRuleMode {
    Unknown = -1,
    IncludeAll = 0,
    ExcludeAll = 1
}


@Component({
    selector: 'ManageDbSource',
    templateUrl: './dbsource.component.html'
})
export class DbSourceComponent {
    private isReady: Boolean = false;
    private projectName: string;
    //private dataSourceKey: string;
    //private isOrmInstalled: boolean = null;
    //private DefaultRuleMode: DefaultRuleMode = DefaultRuleMode.Unknown;

    private dbSource: {
        DataSource?: string;
        DefaultRuleMode?: any;
        InitialCatalog?: string;
        IsOrmInstalled?: boolean;
        JsNamespace?: string;
        Name?: string;
    } = {};


    private isInstallingOrm: boolean = false;

    private execConnectionsList: any;
    private outputFileList: any;
    private pluginList: any;

    private pluginConfigIsDirty: boolean = false;

    private summaryData: any;

    private minifiedLookup: any = {};

    private paramaterSub: any;

    private whitelist: any;
    private allowAllPrivateIPs: boolean = false;

    constructor(private route: ActivatedRoute
        , private project: ProjectComponent
        , private componentFactoryResolver: ComponentFactoryResolver
        , private appRef: ApplicationRef
        , private viewContainerRef: ViewContainerRef) {
        try {
            this.paramaterSub = this.route.params.subscribe(params => {

                this.projectName = project.name;
                this.dbSource = this.project.getDbSource(params["name"]);

                if (this.dbSource.IsOrmInstalled == null) {
                    this.onRecheckOrmClicked();
                }
                else {
                    this.isReady = true;
                    this.dbSource.IsOrmInstalled = this.dbSource.IsOrmInstalled;
                }

                this.refreshSummaryInfo();
                this.refreshDbConnectionList();
                this.refreshOutputFileList();
                this.refreshPluginList();
                this.refreshWhitelist();
            });

        }
        catch (e) {
            alert("!!" + e.toString()); // TODO: Exception handling
        }

    }

    ngOnDestroy() {
        if (this.paramaterSub != null) {
            this.paramaterSub.unsubscribe();
            this.paramaterSub = null;
        }
    }


    private refreshSummaryInfo() {
        L2.fetchJson(`/api/database/summary?projectName=${this.projectName}&dbSource=${this.dbSource.Name}`).then((r: any) => {
            this.summaryData = r.Data;
        });

    }

    private refreshOutputFileList() {
        L2.fetchJson(`/api/database/jsFiles?projectName=${this.projectName}&dbSource=${this.dbSource.Name}`).then((r: any) => {
            this.outputFileList = r.Data;
        });

    }

    private refreshPluginList() {
        L2.fetchJson(`/api/database/plugins?projectName=${this.projectName}&dbSource=${this.dbSource.Name}`).then((r: any) => {
            this.pluginList = r.Data;
            this.pluginConfigIsDirty = false;
        });

    }

    private refreshDbConnectionList() {
        L2.fetchJson(`/api/database/dbconnections?projectName=${this.projectName}&dbSourceName=${this.dbSource.Name}`).then((r: any) => {
            this.execConnectionsList = (<any>r).Data;
        });
    }

    private refreshWhitelist() {
        L2.fetchJson(`/api/database/whitelist?projectName=${this.projectName}&dbSourceName=${this.dbSource.Name}`).then((r: any) => {
            let ar: any[] = (<any>r).Data.Whitelist;

            this.allowAllPrivateIPs = (<any>r).Data.AllowAllPrivate;

            if (ar && ar.length > 0) {
                this.whitelist = ar.join('\r\n');
            }
            else {
                this.whitelist = null;
            }
        });
    }


    private onPluginInclusionChanged() {
        this.pluginConfigIsDirty = true;
    }


    private onSavePluginChangesClicked() {
        var list = this.pluginList.map((p) => { return { Guid: p.Guid, Included: p.Included } });

        L2.postJson(`/api/database/plugins?projectName=${this.projectName}&dbSource=${this.dbSource.Name}`, { body: JSON.stringify(list) }).then(r => {
            L2.Success("Plugin changes saved successfully");
        });
    }

    onInitializeClicked() {

        this.isInstallingOrm = true;

        L2.postJson(`/api/database/installOrm?name=${this.dbSource.Name}&projectName=${this.projectName}`).then(resp => {
            L2.Success("ORM successfully installed");
            this.isInstallingOrm = false;
            this.dbSource.IsOrmInstalled = true;
            //!this.projectService.currentDatabaseSource.IsOrmInstalled = true;

        }).catch((_) => { this.isInstallingOrm = false });

    }

    onRecheckOrmClicked(forceRecheck: boolean = false) {
        this.isReady = false;
        L2.fetchJson(`/api/database/checkOrm?name=${this.dbSource.Name}&projectName=${this.projectName}&forceRecheck=${forceRecheck}`).then((resp: any) => {
            this.isReady = true;
            this.dbSource.IsOrmInstalled = resp.Data == null;
            //!this.projectService.currentDatabaseSource.IsOrmInstalled = this.isOrmInstalled;

            if (this.dbSource.IsOrmInstalled) {
                L2.Success("ORM is installed.");
            }

        }).catch((_) => this.isReady = true);
    }

    private performOrmUninstall() {
        return L2.postJson(`/api/database/uninstallOrm?name=${this.dbSource.Name}&projectName=${this.projectName}`).then(resp => {
            L2.Success("ORM successfully uninstalled");

            this.dbSource.IsOrmInstalled = false;

        }).catch((_) => { this.isInstallingOrm = false });
    }

    onUninstallOrmClicked() {
        BootstrapDialog.show({
            title: 'Confirm action',
            message: `Are you sure you want to uninstall the ORM from <strong>${this.dbSource.Name}</strong>?`,
            buttons: [{
                label: 'Uninstall',
                cssClass: 'btn-primary',
                hotkey: 13,
                action: (dialogItself) => {
                    this.performOrmUninstall().then(() => dialogItself.close());
                }
            }
                , {
                label: 'Cancel',
                action: function (dialogItself) { dialogItself.close(); }
            }]

        });
    }

    onAddNewOutputFileClicked() {
        let $content = $(`<div class="form-group">
    <label for="newFileName">Name</label>
    <input type="text" class="form-control" id="newFileName" placeholder="Name" autofocus>
</div>`);


        BootstrapDialog.show({
            title: 'Create new output file',
            message: $content,
            onshown: () => { $content.find('[autofocus]').focus(); },
            buttons: [{
                hotkey: 13,
                label: 'Create',
                cssClass: 'btn-primary',
                action: (dialogItself) => {
                    this.createNewJsOutputFile($content.find("#newFileName").val()).then((txt) => {
                        if (txt == null || txt == "null") {
                            dialogItself.close();
                        }
                    });
                }
            }
                , {
                label: 'Cancel',
                action: function (dialogItself) { dialogItself.close(); }
            }]

        });
    }

    private createNewJsOutputFile(name: string): Promise<any> {

        return L2.postJson(`/api/database/addJsfile?projectName=${this.projectName}&dbSource=${this.dbSource.Name}&jsFileName=${name}`).then((r) => {
            L2.Success("Output file successfully created.");
            this.refreshOutputFileList();
        });
    }

    private onEditOutputFile(row) {
        let $content = $(`<div class="form-group">
    <label for="newFileName">Name</label>
    <input type="text" class="form-control" id="newFileName" placeholder="Name" autofocus value="${row.Filename}" />
</div>`);


        BootstrapDialog.show({
            title: 'Edit output file',
            message: $content,
            onshown: () => { $content.find('[autofocus]').focus(); },
            buttons: [{
                hotkey: 13,
                label: 'Update',
                cssClass: 'btn-primary',
                action: (dialogItself) => {
                    this.updateOutputFileName(row.Filename, $content.find("#newFileName").val()).then((txt) => {
                        //if (txt == null || txt == "null") {
                        dialogItself.close();
                        //}
                    });
                }
            }
                , {
                label: 'Cancel',
                action: function (dialogItself) { dialogItself.close(); }
            }]

        });

    }

    private updateOutputFileName(oldName: string, newName: string) {
        return L2.putJson(`/api/database/updateJsFile?projectName=${this.projectName}&dbSource=${this.dbSource.Name}&oldName=${oldName}&newName=${newName}`).then((r) => {
            L2.Success(`Output file <strong>${newName}</strong> successfully updated.`);
            this.refreshOutputFileList();
        });
    }

    private onDeleteOutputFile(row) {
        BootstrapDialog.show({
            title: 'Confirm action',
            message: `Are you sure you want to delete the output file <strong>${row.Filename}</strong>?`,
            buttons: [{
                label: 'Delete',
                cssClass: 'btn-primary',
                hotkey: 13,
                action: (dialogItself) => {
                    this.deleteOutputFile(row).then(() => dialogItself.close());
                }
            }
                , {
                label: 'Cancel',
                action: function (dialogItself) { dialogItself.close(); }
            }]

        });
    }

    private deleteOutputFile(row) {

        return L2.deleteJson(`/api/database/deleteJsFile?projectName=${this.projectName}&dbSource=${this.dbSource.Name}&jsFilenameGuid=${row.Guid}`).then(r => {
            this.refreshOutputFileList();
            L2.Success(`<strong>${row.Filename}</strong> successfully deleted`);
        });

    }


    private onAddExecConnectionClicked() {
        try {

            var factory = this.componentFactoryResolver.resolveComponentFactory(DbConnectionDialog);

            var ref = this.viewContainerRef.createComponent(factory);

            ref.instance.ready.subscribe(() => {

                try {
                    ref.instance.projectName = this.projectName;
                    ref.instance.dbSourceName = this.dbSource.Name;
                    ref.instance.rowData = null;


                    ref.instance.show();

                }
                catch (e) {
                    L2.HandleException(e);
                }
            });

            ref.instance.onNewDbAdded.subscribe(() => {
                this.refreshDbConnectionList();
                L2.Success("New database connection added successfully.");
            });


        }
        catch (e) {
            L2.HandleException(e);
        }
    }

    private onEditExecConnectionClicked(row) {
        try {

            var factory = this.componentFactoryResolver.resolveComponentFactory(DbConnectionDialog);

            var ref = this.viewContainerRef.createComponent(factory);

            ref.instance.ready.subscribe(() => {

                try {
                    ref.instance.projectName = this.projectName;
                    ref.instance.dbSourceName = this.dbSource.Name;
                    ref.instance.rowData = row;

                    ref.instance.show();

                }
                catch (e) {
                    L2.HandleException(e);
                }
            });

            ref.instance.onNewDbAdded.subscribe(() => {
                this.refreshDbConnectionList();
                L2.Success("Database updated successfully.");
            });


        }
        catch (e) {
            L2.HandleException(e);
        }
    }

    private onDeleteExecConnectionClicked(row) {

        L2.Confirm(`Are you sure you wish to delete the execution connection <strong>${row.Name}</strong>`, "Confirm action").then(r => {

            L2.deleteJson(`/api/database/dbconnection?dbConnectionGuid=${row.Guid}&projectName=${this.projectName}&dbSourceName=${this.dbSource.Name}`).then(r => {
                L2.Success(`Database connection <strong>${row.Name}</strong> deleted sucessfully`);
                this.refreshDbConnectionList();
            });



        });
    }


    private onManageRulesClicked() {

        try {

            var factory = this.componentFactoryResolver.resolveComponentFactory(RuleManagement);

            var ref = this.viewContainerRef.createComponent(factory);


            ref.instance.ready.subscribe(() => {

                try {
                    ref.instance.projectName = this.projectName;
                    ref.instance.dbSource = this.dbSource.Name;
                    ref.instance.jsFilenameGuid = null;
                    ref.instance.title = this.dbSource.Name;
                    //!?ref.instance.defaultRuleMode = DefaultRuleMode[this.projectService.currentDatabaseSource.DefaultRuleMode];
                    ref.instance.show();

                }
                catch (e) {
                    L2.HandleException(e);
                }
            });


        }
        catch (e) {
            // TODO: Error handling
            alert(e.toString());
        }

    }

    private onUpdateWhitelist(textarea) {
        try {

            return L2.postJson(`/api/database/whitelist?projectName=${this.projectName}&dbSourceName=${this.dbSource.Name}&whitelist=${encodeURIComponent(textarea.value)}&allowAllPrivate=${this.allowAllPrivateIPs}`).then(r => {
                L2.Success(`Whiteslist updated.`);
            });


        }
        catch (e) {
            L2.HandleException(e);
        }
    }


    private onJsFileManageRulesClicked(row) {

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

    }

    private getLastUpdatedAge(dt) {

        var diffInMilliseconds = moment().diff(moment(new Date(dt)), "ms");

        // for usage see https://github.com/EvanHahn/HumanizeDuration.js
        return humanizeDuration(diffInMilliseconds, { round: true, units: ["d", "h", "m"] });
    }

    private viewCachedMetadata() {

        var factory = this.componentFactoryResolver.resolveComponentFactory(MetadataBrowserDialog);
        var ref = this.viewContainerRef.createComponent(factory);

        ref.instance.ready.subscribe(() => {
            ref.instance.projectName = this.projectName;
            ref.instance.dbSourceName = this.dbSource.Name;
            ref.instance.show();
        });


    }

    private clearDbSourceCache() {

        L2.Confirm(`You are about to clear the current DB source's cache.<br/>Are you sure?`, "Confirm action").then(() => {

            L2.postJson(`/api/database/clearcache?projectName=${this.projectName}&dbSource=${this.dbSource.Name}`).then(r => {
                L2.Success("Cached clear successfully");
                this.refreshSummaryInfo();
            });


        });
    }

}