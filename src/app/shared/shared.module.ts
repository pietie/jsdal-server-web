import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { MMatLegacyAutocompleteModule as MatAutocompleteModule} from '@@angular/material/legacy-autocomplete;
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MMatLegacyButtonModule as MatButtonModule} from '@@angular/material/legacy-button;
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MMatLegacyCardModule as MatCardModule} from '@@angular/material/legacy-card;
import { MMatLegacyCheckboxModule as MatCheckboxModule} from '@@angular/material/legacy-checkbox;
import { MMatLegacyChipsModule as MatChipsModule} from '@@angular/material/legacy-chips;
iimport { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MMatLegacyDialogModule as MatDialogModule} from '@@angular/material/legacy-dialog;
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MMatLegacyInputModule as MatInputModule} from '@@angular/material/legacy-input;
import { MMatLegacyListModule as MatListModule} from '@@angular/material/legacy-list;
import { MMatLegacyMenuModule as MatMenuModule} from '@@angular/material/legacy-menu;
import { MMatLegacyPaginatorModule as MatPaginatorModule} from '@@angular/material/legacy-paginator;
import { MMatLegacyProgressBarModule as MatProgressBarModule} from '@@angular/material/legacy-progress-bar;
import { MMatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from '@@angular/material/legacy-progress-spinner;
import { MMatLegacyRadioModule as MatRadioModule} from '@@angular/material/legacy-radio;
import { MMatLegacySelectModule as MatSelectModule} from '@@angular/material/legacy-select;
import { MatSidenavModule } from '@angular/material/sidenav';
import { MMatLegacySlideToggleModule as MatSlideToggleModule} from '@@angular/material/legacy-slide-toggle;
import { MMatLegacySliderModule as MatSliderModule} from '@@angular/material/legacy-slider;
import { MMatLegacySnackBarModule as MatSnackBarModule} from '@@angular/material/legacy-snack-bar;
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MMatLegacyTableModule as MatTableModule} from '@@angular/material/legacy-table;
import { MMatLegacyTabsModule as MatTabsModule} from '@@angular/material/legacy-tabs;
import { MatToolbarModule } from '@angular/material/toolbar';
import { MMatLegacyTooltipModule as MatTooltipModule} from '@@angular/material/legacy-tooltip;




import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IsoDatePipe } from '../pipes/FromISODate';
import { FromEpochPipe } from '../pipes/from-epoch.pipe';
import { LogGrid } from '../controls/log-grid.component';

import { MsgDialog, PromptDialog } from '~/dialogs'
import { MomentFromNowPipe } from '~/pipes/moment-from.pipe';
import { ChartCardComponent } from '~/controls/chart-card/chart-card.component';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  imports: [CommonModule, FormsModule, BrowserAnimationsModule, MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,
    MatBottomSheetModule,
    MatBadgeModule,
    NgChartsModule
  ],
  declarations: [IsoDatePipe, FromEpochPipe, LogGrid, MsgDialog, PromptDialog, MomentFromNowPipe, ChartCardComponent],
  exports: [NgChartsModule, IsoDatePipe, FromEpochPipe, LogGrid, CommonModule, FormsModule, BrowserAnimationsModule, MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,
    MatBottomSheetModule,
    MatBadgeModule,
    MomentFromNowPipe,
    ChartCardComponent
  ],
  entryComponents: [MsgDialog, PromptDialog]

})
export class SharedModule { }
