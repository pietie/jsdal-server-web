import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RouterModule } from '@angular/router'
import { FormsModule } from '@angular/forms'

import { routing } from './app.routes';

import { CanDeactivateGuard } from './services/can-deactivate-guard.service'

import { AppComponent } from './app.component';

import { ProjectsModule } from './projects/projects.module'

import { ThreadsModule } from './threads/threads.module'
import { HomeComponent } from './home/home.component'
import { LoginComponent } from './account/login.component'
import { SessionLog } from './sessionlog/sessionlog.component'
import { Settings } from './settings/settings.component'
import { ExceptionViewerComponent } from './exception-viewer/exception-viewer.component'

import { PerformanceModule } from './performance/performance.module'

import { SharedModule } from './shared/shared.module'

import { LoggedInGuard } from './logged-in.guard';
import { AccountService } from './account/account.service';


@NgModule({
    imports: [BrowserModule, SharedModule, RouterModule, FormsModule, ProjectsModule, /*ThreadsModule,*/ routing
        /*, PerformanceModule*/
    ],
    declarations: [AppComponent
        , HomeComponent
        , LoginComponent
        , SessionLog
        , Settings
        , ExceptionViewerComponent
    ],
    bootstrap: [AppComponent],
    providers: [CanDeactivateGuard, LoggedInGuard, AccountService],
    entryComponents: []

})
export class AppModule { }  