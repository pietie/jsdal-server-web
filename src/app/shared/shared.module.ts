import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';

import { IsoDatePipe } from '../pipes/FromISODate';
import { LogGrid } from '../controls/LogGrid';

import { MsgDialog, PromptDialog  } from '~/dialogs'

@NgModule({
    imports: [CommonModule, FormsModule, MaterialModule],
    declarations: [IsoDatePipe, LogGrid, MsgDialog, PromptDialog],
    exports: [IsoDatePipe, LogGrid, CommonModule, FormsModule, MaterialModule],
    entryComponents: [MsgDialog, PromptDialog]

})
export class SharedModule { }   