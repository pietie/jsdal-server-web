import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'

import { ProjectMasterComponent } from './master/project-master.component';

import { ProjectListComponent } from './project-list.component'
import { ProjectComponent } from './project.component'
import { ApplicationComponent } from './application/application.component'
import { ApplicationRouteResolver } from './application/application.resolver'
import { CanDeactivateGuard } from '../services/can-deactivate-guard.service'
import { LoggedInGuard } from '../logged-in.guard';

import { EndpointDetailComponent } from './endpoints/endpoints-detail.component'
import { EndpointListComponent } from './endpoints/endpoints-list.component';
import { EndpointsDetailRouteResolver } from './endpoints/endpoints-detail.resolver'


export const projectsRoutes: Routes = [
    {
        path: 'projects',
        component: ProjectMasterComponent,
        canActivate: [LoggedInGuard],
        children: [
            {
                path: '',
                canActivate: [LoggedInGuard],
                component: ProjectListComponent,
            },
            {
                path: ':project',
                component: ProjectComponent,
                canActivate: [LoggedInGuard],
                canDeactivate: [CanDeactivateGuard]

            },
            {
                path: ':project/:dbSource',
                canActivate: [LoggedInGuard],
                component: ApplicationComponent,
                resolve: {
                    dbSource: ApplicationRouteResolver
                },
                children: [
                    {
                        path: 'endpoint/:endpoint',
                        canActivate: [LoggedInGuard],
                        component: EndpointDetailComponent,
                        resolve: {
                            endpoint: EndpointsDetailRouteResolver
                        }
                    }
                ]
            }

        ]
    }





];

/*
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
                        },
                        children: [
                            {
                                path: 'endpoint',
                                children: [

                                    {
                                        path: ':name',
                                        canActivate: [LoggedInGuard],
                                        outlet: 'endpoint-detail',
                                        component: EndpointDetailComponent
                                    }

                                ]
                            }

                        ]
                    }
                ]
            }
        ]
    }

];
*/

export const projectsRouting: ModuleWithProviders = RouterModule.forChild(projectsRoutes);