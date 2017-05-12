import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component'
import { LoginComponent } from './account/login.component'
import { SessionLog } from './sessionlog/sessionlog.component'
import { Settings } from './settings/settings.component'
import { ExceptionViewerComponent } from './exception-viewer/exception-viewer.component';

import { CanDeactivateGuard }  from './services/can-deactivate-guard.service'
import { LoggedInGuard }   from './logged-in.guard';
  
export const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
    },
    { path: 'login', component: LoginComponent, canDeactivate: [CanDeactivateGuard] },
    { path: 'home', component: HomeComponent, canActivate: [LoggedInGuard] },
    { path: 'projects', loadChildren: './projects/projects.module#ProjectsModule', canActivate: [LoggedInGuard] },
    { path: 'sessionlog', component: SessionLog, canActivate: [LoggedInGuard] },
    { path: 'settings', component: Settings, canActivate: [LoggedInGuard] },
    { path: 'exceptions', component: ExceptionViewerComponent, canActivate: [LoggedInGuard] },
   

];

 
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: false });

 