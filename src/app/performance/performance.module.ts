
import { NgModule }         from '@angular/core';
import { SharedModule }       from '../shared/shared.module';

import { PerformanceComponent } from './performance.component'
import { DbSourceListComponent } from './dbsource-list.component'
import { PerformanceDetailComponent } from './performance-detail.component'

import { performanceRouting } from './performance.routes';
import { RealTimePerformanceComponent } from './real-time-performance/real-time-performance.component'



@NgModule({
    declarations: [
        PerformanceComponent, DbSourceListComponent, PerformanceDetailComponent, RealTimePerformanceComponent
    ],
    imports: [SharedModule, performanceRouting]

})
export class PerformanceModule { }   