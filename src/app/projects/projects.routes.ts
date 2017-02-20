import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'

import { ProjectsContainer, ProjectsComponent } from './projects.component'
import { ManageProjectView } from './manageproject.component'
import { ManageDbSource } from './managedbsource.component'
import { CanDeactivateGuard } from '../services/can-deactivate-guard.service'
import { LoggedInGuard } from '../logged-in.guard';

export const projectsRoutes: Routes = [

    {
        path: 'projects',
        canActivate: [LoggedInGuard],
        component: ProjectsComponent,
        children: [
             {
                path: ':name',
                component: ManageProjectView, 
                 canActivate: [LoggedInGuard],
                 canDeactivate: [CanDeactivateGuard],
                children: [
                    {
                        path: ':name',
                        canActivate: [LoggedInGuard],
                        component: ManageDbSource
                    }
                ]
            }

        ]

    }
];


export const projectsRouting: ModuleWithProviders = RouterModule.forChild(projectsRoutes);