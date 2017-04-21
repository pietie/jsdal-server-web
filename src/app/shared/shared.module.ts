import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IsoDatePipe } from '../pipes/FromISODate';
import { LogGrid } from '../controls/log-grid.component';

import { MsgDialog, PromptDialog  } from '~/dialogs'

@NgModule({
    imports: [CommonModule, FormsModule, MaterialModule, BrowserAnimationsModule],
    declarations: [IsoDatePipe, LogGrid, MsgDialog, PromptDialog],
    exports: [IsoDatePipe, LogGrid, CommonModule, FormsModule, MaterialModule, BrowserAnimationsModule],
    entryComponents: [MsgDialog, PromptDialog]

})
export class SharedModule { }   