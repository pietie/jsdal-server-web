
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { ProjectService } from './projects.service'

import { ProjectListComponent } from './project-list.component'
import { projectsRouting } from './projects.routes'
import { ProjectComponent } from './project.component'
import { DbSourceComponent, DbSourceRouteResolver } from './dbsource.component'

// import { ParametersDialog } from '../metadatabrowser/parameters.dialog'
// import { ResultsErrorDialog } from '../metadatabrowser/resulterror.dialog'
// import { TablesDialog } from '../metadatabrowser/tables.dialog'

import { DataSourceDialog, RulesDialog, MetadataViewerDialog, MetadataMoreInfoDialog } from './dialogs'


@NgModule({
    declarations: [
        ProjectListComponent,
        ProjectComponent,
        DbSourceComponent,

        DataSourceDialog,
        RulesDialog,
        MetadataViewerDialog,
        MetadataMoreInfoDialog

    ],
    imports: [SharedModule, projectsRouting],
    providers: [ProjectService, DbSourceRouteResolver],
    entryComponents: [
        DataSourceDialog,
        RulesDialog,
        MetadataViewerDialog,
        MetadataMoreInfoDialog
    ]


})
export class ProjectsModule { }   