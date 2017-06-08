import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'

import { routing } from './app.routes';

import { CanDeactivateGuard } from './services/can-deactivate-guard.service'

import { AppComponent } from './app.component';

import { FirstTimeSetupComponent } from './1st-time/1st-time-setup.component';
import { FirstTimeSetupCompletedGuard } from './1st-time/1st-time-setup-completed.guard';

import { ProjectsModule } from './projects/projects.module'

import { ThreadsModule } from './threads/threads.module'
import { HomeComponent } from './home/home.component'
import { LoginComponent } from './account/login.component'
import { SessionLog } from './sessionlog/sessionlog.component'
import { Settings } from './settings/settings.component'
import { ExceptionViewerComponent } from './exception-viewer/exception-viewer.component'

import { WorkersComponent } from './workers/workers.component'
import { WorkerDetailComponent } from './workers/worker-detail.component'

import { PerformanceModule } from './performance/performance.module'

import { SharedModule } from './shared/shared.module'

import { LoggedInGuard } from './logged-in.guard';
import { AccountService } from './account/account.service';

import { FirstTimeSetupCompletedService } from './1st-time/1st-time-setup-completed.service';


@NgModule({
    imports: [BrowserModule, SharedModule, RouterModule, FormsModule, ProjectsModule, routing, PerformanceModule
    ],
    declarations: [AppComponent,
        HomeComponent,
        LoginComponent,
        SessionLog,
        Settings,
        ExceptionViewerComponent,
        WorkersComponent,
        WorkerDetailComponent,
        FirstTimeSetupComponent
    ],
    bootstrap: [AppComponent],
    providers: [CanDeactivateGuard, LoggedInGuard, AccountService, FirstTimeSetupCompletedGuard, FirstTimeSetupCompletedService],
    entryComponents: []

})
export class AppModule { }  