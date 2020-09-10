import { ModuleWithProviders }   from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { ThreadsViewComponent, ThreadLogComponent } from './threads.component'

import { CanDeactivateGuard }  from '../services/can-deactivate-guard.service'
import { LoggedInGuard }   from '../logged-in.guard';

export const threadRoutes: Routes = [
    {
        path: 'threads',
        canActivate: [LoggedInGuard],
        children: [
            {
                path: '',
                canActivate: [LoggedInGuard],
                component: ThreadsViewComponent,
                children: [
                    { path: '', canActivate: [LoggedInGuard] },
                    { path: 'log', component: ThreadLogComponent, canActivate: [LoggedInGuard] }
                ]
            }

         ]
    },
];


export const threadsRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(threadRoutes);
