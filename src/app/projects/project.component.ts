import {
    Component, Injector, ViewChild, ApplicationRef, EventEmitter, Output, Host, ComponentFactoryResolver, ViewContainerRef, Input
} from '@angular/core'

import { trigger, state, style, transition, animate } from '@angular/animations';

import { MMatLegacyDialog as MatDialog MMatLegacyDialogRef as MatDialogRef} from '@@angular/material/legacy-dialog;

import { ProjectService, IDBSource } from './projects.service'

import { DatasourceDialogComponent,  AuthenticationType } from './dialogs';

import { ActivatedRoute, Router } from '@angular/router';
import { Route, CanDeactivate } from '@angular/router'
import { Observable, of as  ofObservable } from 'rxjs';
import { delay as delayObservable } from 'rxjs/operators';

import { BreadcrumbsService } from './master/breadcrumbs/breadcrumbs.service';



import { L2 } from 'l2-lib/L2';

@Component({
    selector: 'ManageProject',
    templateUrl: './project.component.html',
    animations: [
        trigger('componentState', [
            state('void', style({ opacity: 0, transform: 'translateX(-100%)' })),
            state('enterComponent', style({ opacity: 1, transform: 'translateX(0)' })),
            state('exitComponent', style({ opacity: 0.5, transform: 'translateX(-100%)' })),
            transition('* => enterComponent', animate('300ms ease-in')),
            transition('enterComponent => exitComponent', animate('150ms ease-in'))
        ]),
    ]
})
export class ProjectComponent {
    public projectName: string;
    public dbList: any;

    public get name(): string { return this.projectName; }

    public componentState = "enterComponent";

    constructor(
        public projectService: ProjectService
        , public route: ActivatedRoute
        , public router: Router
        , public dialog: MatDialog
        , public componentFactoryResolver: ComponentFactoryResolver
        , public injector: Injector
        , public appRef: ApplicationRef
        , public viewContainerRef: ViewContainerRef
        , public breadcrumb: BreadcrumbsService
    ) {
    }

    ngOnInit() {

        this.route.params.subscribe(params => {
            this.projectName = params["project"];
            this.componentState = "enterComponent";

            this.breadcrumb.store([{ label: 'Projects', url: '/projects', params: [] }
                , { label: this.projectName, url: `/projects/${this.projectName}`, params: [] }]);

            this.refreshDbList();
        });

    }

    canDeactivate(): Observable<boolean> | boolean {
        this.componentState = "exitComponent";
        return ofObservable(true).pipe(delayObservable(200)); // TODO: Hook into animation complete event
    }

    refreshDbList() {
        this.projectService.getAllApps(this.projectName).then(r => {
            this.dbList = r; // TODO: bind grid directly to service  
        });
    }



    public onAddEditAppClicked(row) {
        try {

            let dialogRef = this.dialog.open(DatasourceDialogComponent);

            dialogRef.componentInstance.title = "Add application";

            if (row) {
                dialogRef.componentInstance.title = "Update application";

                dialogRef.componentInstance.data = {
                    logicalName: row.Name,
                    defaultRuleMode: row.DefaultRuleMode.toString(),
                    guid: row.Guid
                };
            }

            dialogRef.afterClosed().subscribe(r => {
                if (r) {

                    try {
                        let obj:any = dialogRef.componentInstance.data;

                        if (!row) obj.guid = null;


                        if (!row) {
                            // add new
                            L2.postJson(`/api/app?project=${this.projectName}&jsNamespace=${L2.nullToEmpty(null)}&defaultRuleMode=${obj.defaultRuleMode}`
                                , { body: JSON.stringify(obj.logicalName) }).then(r => {
                                    L2.success("New application added successfully");
                                    this.refreshDbList();
                                });
                        }
                        else {
                            // update
                            L2.putJson(`/api/app/update?project=${this.projectName}&oldName=${row.Name}&jsNamespace=${L2.nullToEmpty(null)}&defaultRuleMode=${obj.defaultRuleMode}`
                                , { body: JSON.stringify(obj.logicalName) }).then(r => {
                                    L2.success("Application updated successfully");
                                    this.refreshDbList();
                                });
                        }


                    }
                    catch (e) {
                        L2.handleException(e);
                    }
                }
            });
        }
        catch (e) {
            L2.handleException(e);
        }
    }


    onDeleteApp(row) {
        L2.confirm(`Are you sure you want to delete the application <strong>${row.Name}</strong>?`, "Confirm action").then(r => {
            if (r) this.deleteApplication(row.Name);
        });
    }

    public deleteApplication(name: string) {
        return L2.deleteJson(`/api/app/${name}?project=${this.projectName}`, { body: JSON.stringify(name) }).then(() => {
            L2.success(`Application ${name} successfully deleted.`);

            this.refreshDbList();

            let child: any = this.route.firstChild;

            // redirect back up to this level if a child has been deleted
            if (child && child.params.getValue().name == name) {
                this.router.navigate(['./'], { relativeTo: this.route });
            }
        });
    }


}

