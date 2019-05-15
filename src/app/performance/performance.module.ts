
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { PerformanceComponent } from './performance.component'
import { DbSourceListComponent } from './dbsource-list.component'
import { PerformanceDetailComponent } from './performance-detail.component'

import { performanceRouting } from './performance.routes'
    ;
import { RealTimePerformanceComponent } from './real-time-performance/real-time-performance.component'
    ;
import { TopResourcesComponent } from './top-resources/top-resources.component'
    ;
import { RoutineListComponent } from './routine-list/routine-list.component'


@NgModule({
    declarations: [
        PerformanceComponent,
        DbSourceListComponent,
        PerformanceDetailComponent,
        RealTimePerformanceComponent,
        TopResourcesComponent,
        RoutineListComponent
    ],
    imports: [SharedModule, performanceRouting]

})
export class PerformanceModule { }   