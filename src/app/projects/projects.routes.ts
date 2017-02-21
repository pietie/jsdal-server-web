import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'

import { ProjectListComponent } from './project-list.component'
import { ProjectComponent } from './project.component'
import { DbSourceComponent, DbSourceRouteResolver } from './dbsource.component'
import { CanDeactivateGuard } from '../services/can-deactivate-guard.service'
import { LoggedInGuard } from '../logged-in.guard';

export const projectsRoutes: Routes = [

    {
        path: 'projects',
        canActivate: [LoggedInGuard],
        component: ProjectListComponent,
        children: [
            {
                path: ':name',
                component: ProjectComponent,
                canActivate: [LoggedInGuard],
                canDeactivate: [CanDeactivateGuard],
                children: [
                    {
                        path: ':name',
                        canActivate: [LoggedInGuard],
                        component: DbSourceComponent,
                        resolve: {
                            dbSource: DbSourceRouteResolver
                        }
                    }
                ]
            }

        ]

    }
];


export const projectsRouting: ModuleWithProviders = RouterModule.forChild(projectsRoutes);