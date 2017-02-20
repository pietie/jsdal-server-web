
import { NgModule }         from '@angular/core';
import { SharedModule }       from '../shared/shared.module';

import { ProjectsContainer, ProjectsComponent } from './projects.component'
import { projectsRouting } from './projects.routes'
import { ManageProjectView, AddNewDatabaseSourceDialog  } from './manageproject.component'
import { ManageDbSource } from './managedbsource.component'
import { DbConnectionDialog  } from './dbconnection.dialog'

import { L2Dialog } from '../controls/dialog.component'


import { RuleManagement } from '../rules/rules.component'

import { MetadataBrowserDialog } from '../metadatabrowser/metadatabrowser.dialog'
import { ParametersDialog } from '../metadatabrowser/parameters.dialog'
import { ResultsErrorDialog } from '../metadatabrowser/resulterror.dialog'
import { TablesDialog } from '../metadatabrowser/tables.dialog'


@NgModule({
    declarations: [
        ProjectsContainer, ProjectsComponent,
        ManageProjectView,
        ManageDbSource,
        DbConnectionDialog, AddNewDatabaseSourceDialog, RuleManagement, MetadataBrowserDialog, L2Dialog
        , ParametersDialog, ResultsErrorDialog, TablesDialog
    ],
    imports: [SharedModule, projectsRouting],
    entryComponents: [DbConnectionDialog, AddNewDatabaseSourceDialog, RuleManagement, MetadataBrowserDialog, L2Dialog, ParametersDialog, ResultsErrorDialog, TablesDialog],


})
export class ProjectsModule { }   