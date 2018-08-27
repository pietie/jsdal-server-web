
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { BreadcrumbComponent } from './master/breadcrumbs/breadcrumbs.component';
import { BreadcrumbsService } from './master/breadcrumbs/breadcrumbs.service';

import { ProjectService } from './projects.service'

import { ProjectMasterComponent } from './master/project-master.component';

import { ProjectListComponent } from './project-list.component'
import { projectsRouting } from './projects.routes'
import { ProjectComponent } from './project.component'
import { ApplicationComponent } from './application/application.component'

import { EndpointListComponent } from './endpoints/endpoints-list.component'
import { EndpointDetailComponent } from './endpoints/endpoints-detail.component'


import { DatasourceDialogComponent, MetadataViewerDialog, MetadataMoreInfoDialog, ConnectionDialogComponent } from './dialogs'
import { ApplicationRouteResolver } from './application/application.resolver';
import { EndpointsDetailRouteResolver } from './endpoints/endpoints-detail.resolver';
import { EndpointDALService } from '~/projects/endpoints/endpoint-dal.service';

import { RulesComponent } from './../rules/rules.component';
import { RuleAddupdateDialogComponent } from './../rules/dialogs/rule-addupdate-dialog.component';


@NgModule({
    declarations: [
        BreadcrumbComponent,
        ProjectMasterComponent,
        ProjectListComponent,
        ProjectComponent,
        ApplicationComponent,
        EndpointListComponent,
        EndpointDetailComponent,

        DatasourceDialogComponent,
        
        MetadataViewerDialog,
        MetadataMoreInfoDialog,
        ConnectionDialogComponent,
        RulesComponent,
        RuleAddupdateDialogComponent

    ],
    imports: [SharedModule, projectsRouting],
    providers: [BreadcrumbsService, ProjectService, ApplicationRouteResolver, EndpointsDetailRouteResolver, EndpointDALService],
    entryComponents: [
        DatasourceDialogComponent,
        
        MetadataViewerDialog,
        MetadataMoreInfoDialog ,
        ConnectionDialogComponent,
        RuleAddupdateDialogComponent
    ]


})
export class ProjectsModule { }   