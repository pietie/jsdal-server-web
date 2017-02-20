import { NgModule }         from '@angular/core';
import { SharedModule } from '../shared/shared.module'

import { ThreadsViewComponent, ThreadLogComponent } from './threads.component'
import { threadsRouting } from './threads.routes'

@NgModule({
    declarations: [ThreadsViewComponent, ThreadLogComponent],
    imports: [SharedModule, threadsRouting],
})
export class ThreadsModule { }    