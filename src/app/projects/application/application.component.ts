import { Component, ApplicationRef, Directive, Input, ComponentFactoryResolver, ViewContainerRef } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { L2 } from 'l2-lib/L2';

import { IDBSource } from './../projects.service'


import { DatasourceDialogComponent, AuthenticationType } from './../dialogs';

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

        this.api.app.jsfiles.getAll(this.projectName, this.dbSource.Name).then(r => {
            this.outputFileList = r;
            this.outputFileBusy = false;
        }).catch(e => this.outputFileBusy = false);
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

        return this.api
            .app
            .jsfiles.add(this.projectName, this.dbSource.Name, name).then(() => {
                L2.success("Output file successfully created.");
                this.outputFileBusy = false;
                this.refreshOutputFileList();
            }).catch(e => { this.outputFileBusy = false; });;

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
        return this.api.app
            .jsfiles.update(this.projectName, this.dbSource.Name, oldName, newName)
            .then((r) => {
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
        return this.api.app
            .jsfiles.delete(this.projectName, this.dbSource.Name, row.Filename)
            .then(r => {
                this.refreshOutputFileList();
                this.outputFileBusy = false;
                L2.success(`${row.Filename} successfully deleted`);
            }).catch(e => this.outputFileBusy = false);

    }

    /*
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

    }*/

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


    // public onJsFileManageRulesClicked(row) {
    //     let dialogRef = this.dialog.open(RulesDialog);

    //     dialogRef.componentInstance.projectName = this.projectName;
    //     dialogRef.componentInstance.dbSource = this.dbSource.Name;
    //     dialogRef.componentInstance.jsFilenameGuid = row.Guid;
    //     dialogRef.componentInstance.title = row.Filename;
    //     dialogRef.componentInstance.defaultRuleMode = this.dbSource.DefaultRuleMode;

    //     dialogRef.afterClosed().subscribe(r => {

    //     });

         
    // }

}