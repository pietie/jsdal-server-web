import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'

import { PerformanceComponent } from './performance.component'
import { DbSourceListComponent } from './dbsource-list.component'
import { PerformanceDetailComponent } from './performance-detail.component'

import { CanDeactivateGuard } from '../services/can-deactivate-guard.service'
import { LoggedInGuard } from '../logged-in.guard';

export const projectsRoutes: Routes = [
    {
        path: 'performance',
        canActivate: [LoggedInGuard],
        component: PerformanceComponent,
        children: [
            {
                path: ':project',
                component: DbSourceListComponent,
                canActivate: [LoggedInGuard],
                children: [
                    {
                        path: ':dbSource',
                        component: PerformanceDetailComponent,
                        canActivate: [LoggedInGuard]
                    }
                ]
            }
        ]
    }
];


export const performanceRouting: ModuleWithProviders = RouterModule.forChild(projectsRoutes);