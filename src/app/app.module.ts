import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

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

import { BgtasksComponent } from '~/bgtasks/bgtasks.component'
import { BgTaskMonitorService } from '~/services/bgtask-monitor.service';;
import { ExecutionTesterComponent } from './execution-tester/execution-tester.component';;
import { ExceptionDetailComponent } from './exception-viewer/exception-detail/exception-detail.component';
import { BackgroundThreadsComponent } from './plugins/tabs/background-threads/background-threads/background-threads.component';
import { ManageBackgroundThreadComponent } from './plugins/tabs/background-threads/manage-background-thread/manage-background-thread.component';
import { KeysPipe } from './pipes/keys-pipe.pipe';
import { AddEditPluginComponent } from './plugins/add-edit-plugin/add-edit-plugin.component';
import { PluginTemplateBottomSheetComponent } from './plugins/add-edit-plugin/plugin-template-bottom-sheet/plugin-template-bottom-sheet.component';
import { ExceptionUiComponent } from './exception-viewer/exception-detail/exception-ui/exception-ui.component';
import { ExceptionRecentItemComponent } from './exception-viewer/exception-recent-item/exception-recent-item.component';
import { BlobViewerComponent } from './blob-viewer/blob-viewer.component';;
import { HealthComponent } from './health/health.component'
import { ChartCardComponent } from './controls/chart-card/chart-card.component';;
import { DiagnosticsComponent } from './plugins/tabs/diagnostics/diagnostics.component'
  ;
import { InlineAssembliesComponent } from './plugins/tabs/inline-assemblies/inline-assemblies.component'
  ;
import { ExecutionPluginsComponent } from './plugins/tabs/execution-plugins/execution-plugins.component'
  ;
import { UptimeHistoryDialogComponent } from './home/uptime-history-dialog/uptime-history-dialog.component'
  ;
import { SecondsToTimePipe } from './pipes/seconds-to-time.pipe'
export class MyErrorHandler implements ErrorHandler {

  constructor() {

  }

  handleError(error) {
    console.info("custom error handler: ", error);
    throw new Error("Whoops");
  }
}

@NgModule({
  imports: [BrowserModule, SharedModule, RouterModule, FormsModule, ProjectsModule, routing, PerformanceModule, AceEditorModule, ReactiveFormsModule],
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
    ServerMethodsComponent,
    BgtasksComponent,
    ExecutionTesterComponent,
    ExceptionDetailComponent,
    BackgroundThreadsComponent,
    ManageBackgroundThreadComponent,
    KeysPipe,
    AddEditPluginComponent,
    PluginTemplateBottomSheetComponent,
    ExceptionUiComponent,
    ExceptionRecentItemComponent,
    BlobViewerComponent,
    HealthComponent,
    DiagnosticsComponent,
    InlineAssembliesComponent,
    ExecutionPluginsComponent,
    UptimeHistoryDialogComponent,
    SecondsToTimePipe
  ],


  bootstrap: [AppComponent],
  providers: [CanDeactivateGuard, LoggedInGuard, AccountService, FirstTimeSetupCompletedGuard, FirstTimeSetupCompletedService, BgTaskMonitorService/*, {provide: ErrorHandler, useClass: MyErrorHandler}*/],
  entryComponents: [PluginTemplateBottomSheetComponent]

})
export class AppModule { }
