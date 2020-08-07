import { ModuleWithProviders, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FirstTimeSetupComponent } from './1st-time/1st-time-setup.component';
import { FirstTimeSetupCompletedGuard } from './1st-time/1st-time-setup-completed.guard';
import { FirstTimeNetworkErrorComponent } from './1st-time/1st-time-network-error.component';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './account/login.component';
import { SessionLog } from './sessionlog/sessionlog.component';
import { Settings } from './settings/settings.component';
import { ExceptionViewerComponent } from './exception-viewer/exception-viewer.component';

import { WorkersComponent } from './workers/workers.component';
import { WorkerDetailComponent } from './workers/worker-detail.component'

import { PluginsComponent } from './plugins/plugins.component'

import { CanDeactivateGuard } from './services/can-deactivate-guard.service'
import { LoggedInGuard } from './logged-in.guard';
import { BgtasksComponent } from '~/bgtasks/bgtasks.component';
import { ExecutionTesterComponent } from './execution-tester/execution-tester.component';
import { ExceptionDetailComponent } from './exception-viewer/exception-detail/exception-detail.component';
import { ManageBackgroundThreadComponent } from './plugins/tabs/background-threads/manage-background-thread/manage-background-thread.component';
import { AddEditPluginComponent } from './plugins/add-edit-plugin/add-edit-plugin.component';
import { BlobViewerComponent } from './blob-viewer/blob-viewer.component';


export const appRoutes: Routes = [
  {
    path: '',

    component: HomeComponent,
    canActivate: [LoggedInGuard]
  },
  { path: '1st-time', component: FirstTimeSetupComponent },
  { path: 'network-error', component: FirstTimeNetworkErrorComponent },
  { path: 'login', component: LoginComponent, canDeactivate: [CanDeactivateGuard], canActivate: [FirstTimeSetupCompletedGuard] },
  { path: 'home', component: HomeComponent, canActivate: [LoggedInGuard] },
  { path: 'projects', loadChildren: () => import('./projects/projects.module').then(m => m.ProjectsModule), canActivate: [LoggedInGuard] },
  { path: 'sessionlog', component: SessionLog, canActivate: [LoggedInGuard] },
  { path: 'settings', component: Settings, canActivate: [LoggedInGuard] },
  {
    path: 'exceptions', component: ExceptionViewerComponent, canActivate: [LoggedInGuard], children: [

      { path: ':id', canActivate: [LoggedInGuard], component: ExceptionDetailComponent }

    ]

  },
  {
    path: 'workers',
    component: WorkersComponent,
    canActivate: [LoggedInGuard],
    children: [
      {
        path: ':id',
        component: WorkerDetailComponent
      }

    ]
  },
  { path: 'bgtasks', component: BgtasksComponent, canActivate: [LoggedInGuard] },
  { path: 'blobs', component: BlobViewerComponent, canActivate: [LoggedInGuard] },
  { path: 'plugins', component: PluginsComponent, canActivate: [LoggedInGuard] },
  { path: 'plugins/edit', component: AddEditPluginComponent, canActivate: [LoggedInGuard] },
  { path: 'plugins/edit/:id', component: AddEditPluginComponent, canActivate: [LoggedInGuard] },
  { path: 'plugins/bgthread/:id', component: ManageBackgroundThreadComponent, canActivate: [LoggedInGuard] },
  {
    path: 'exec-test', component: ExecutionTesterComponent, canActivate: [LoggedInGuard]
  },
  {
    path: 'exec-test/:project/:app/:endpoint', component: ExecutionTesterComponent, canActivate: [LoggedInGuard]
  }


];


export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: false });

