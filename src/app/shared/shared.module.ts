import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';

import { IsoDatePipe } from '../pipes/FromISODate';
import { LogGrid } from '../controls/LogGrid';

import { MsgDialog } from '~/dialogs/msg-dialog.component'

@NgModule({
    imports: [CommonModule, FormsModule, MaterialModule],
    declarations: [IsoDatePipe, LogGrid, MsgDialog],
    exports: [IsoDatePipe, LogGrid, CommonModule, FormsModule, MaterialModule],
    entryComponents: [MsgDialog]

})
export class SharedModule { }   