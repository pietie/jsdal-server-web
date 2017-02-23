﻿
import { NgModule }         from '@angular/core';
import { SharedModule }       from '../shared/shared.module';

import { ProjectService } from './projects.service'

import { ProjectListComponent } from './project-list.component'
import { projectsRouting } from './projects.routes'
import { ProjectComponent, AddNewDatabaseSourceDialog  } from './project.component'
import { DbSourceComponent, DbSourceRouteResolver } from './dbsource.component'

import { L2Dialog } from '../controls/dialog.component'


import { RuleManagement } from '../rules/rules.component'

import { MetadataBrowserDialog } from '../metadatabrowser/metadatabrowser.dialog'
import { ParametersDialog } from '../metadatabrowser/parameters.dialog'
import { ResultsErrorDialog } from '../metadatabrowser/resulterror.dialog'
import { TablesDialog } from '../metadatabrowser/tables.dialog'

import { DbConnectionDialogV2 } from './dialogs/dbconnection.dialog'


@NgModule({
    declarations: [
        ProjectListComponent,
        ProjectComponent,
        DbSourceComponent,
        
        DbConnectionDialogV2,

         AddNewDatabaseSourceDialog, RuleManagement, MetadataBrowserDialog, L2Dialog
        , ParametersDialog, ResultsErrorDialog, TablesDialog
    ],
    imports: [SharedModule, projectsRouting],
    providers: [ ProjectService, DbSourceRouteResolver ],
    entryComponents: [
        DbConnectionDialogV2,
        AddNewDatabaseSourceDialog, RuleManagement, MetadataBrowserDialog, L2Dialog, ParametersDialog, ResultsErrorDialog, TablesDialog],


})
export class ProjectsModule { }   