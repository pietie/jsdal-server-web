import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';

import { IsoDatePipe } from '../pipes/FromISODate';
import { LogGrid } from '../controls/LogGrid';

@NgModule({
    imports: [CommonModule, FormsModule, MaterialModule],
    declarations: [IsoDatePipe, LogGrid],
    exports: [IsoDatePipe, LogGrid,
        CommonModule, FormsModule, MaterialModule]
})
export class SharedModule { }   