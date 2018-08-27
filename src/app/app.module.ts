import { NgModule, ErrorHandler } from '@angular/core';
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

import { PluginsComponent } from './plugins/plugins.component'

import { PerformanceModule } from './performance/performance.module'

import { SharedModule } from './shared/shared.module'

import { LoggedInGuard } from './logged-in.guard';
import { AccountService } from './account/account.service';

import { FirstTimeSetupCompletedService } from './1st-time/1st-time-setup-completed.service';
import { FirstTimeNetworkErrorComponent } from './1st-time/1st-time-network-error.component';

import { CsharpTextareaComponent } from './controls/csharp-textarea/csharp-textarea.component';



import { AceEditorModule } from 'ng2-ace-editor';
import { ServerMethodsComponent } from './plugins/tabs/server-methods/server-methods.component';


export class MyErrorHandler implements ErrorHandler {
    
    constructor()
    {

    }

    handleError(error) {
      console.info("custom error handler: ", error);
      throw new Error("Whoops");
    }
 }

@NgModule({
    imports: [BrowserModule, SharedModule, RouterModule, FormsModule, ProjectsModule, routing, PerformanceModule, AceEditorModule],
    declarations: [AppComponent,
        HomeComponent,
        LoginComponent,
        SessionLog,
        Settings,
        ExceptionViewerComponent,
        WorkersComponent,
        WorkerDetailComponent,
        FirstTimeSetupComponent,
        FirstTimeNetworkErrorComponent,
        PluginsComponent,
        CsharpTextareaComponent,
        ServerMethodsComponent
    ],
    bootstrap: [AppComponent],
    providers: [CanDeactivateGuard, LoggedInGuard, AccountService, FirstTimeSetupCompletedGuard, FirstTimeSetupCompletedService/*, {provide: ErrorHandler, useClass: MyErrorHandler}*/ ],
    entryComponents: [  ]

})
export class AppModule { }    