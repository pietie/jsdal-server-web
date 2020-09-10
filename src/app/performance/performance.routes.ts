import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'

import { PerformanceComponent } from './performance.component'
import { DbSourceListComponent } from './dbsource-list.component'
import { PerformanceDetailComponent } from './performance-detail.component'

import { CanDeactivateGuard } from '../services/can-deactivate-guard.service'
import { LoggedInGuard } from '../logged-in.guard';
import { RealTimePerformanceComponent } from './real-time-performance/real-time-performance.component';
import { RoutineListComponent } from './routine-list/routine-list.component';
import { TopResourcesComponent } from './top-resources/top-resources.component';

export const projectsRoutes: Routes = [
    {
        path: 'performance',
        canActivate: [LoggedInGuard],
        component: PerformanceComponent,
        children: [
            {
                path: 'real-time',
                component: RealTimePerformanceComponent,
                canActivate: [LoggedInGuard]

            },
            {
                path: 'routine-list',
                component: RoutineListComponent,
                canActivate: [LoggedInGuard]

            },
            {
                path: 'top',
                component: TopResourcesComponent,
                canActivate: [LoggedInGuard]

            }
        ]
    }
];


export const performanceRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(projectsRoutes);
