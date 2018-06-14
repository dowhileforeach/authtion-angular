import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {
  MatButtonModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatInputModule,
  MatNativeDateModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatTooltipModule
} from '@angular/material';

import {AlertDwfeComponent} from '@dwfe/components/alert/alert.component';
import {DatePickerDwfeComponent} from '@dwfe/components/form-control/date-picker/date-picker.component';
import {InputEmailDwfeComponent} from '@dwfe/components/form-control/input-email/input-email.component';
import {InputPasswordDwfeComponent} from '@dwfe/components/form-control/input-password/input-password.component';
import {InputTextDwfeComponent} from '@dwfe/components/form-control/input-text/input-text.component';
import {SelectDwfeComponent} from '@dwfe/components/form-control/select/select.component';
import {PageNotFoundDwfeComponent} from '@dwfe/components/page-not-found/page-not-found.component';
import {SpinnerDottedHorizontalDwfeComponent} from '@dwfe/components/spinner/spinner-dotted-horizontal/spinner-dotted-horizontal.component';
import {SpinnerSharkFinCircleDwfeComponent} from '@dwfe/components/spinner/spinner-shark-fin-circle/spinner-shark-fin-circle.component';
import {SlideToggleDwfeComponent} from '@dwfe/components/form-control/slide-toggle/slide-toggle.component';
import {ClearControlDwfeComponent} from '@dwfe/components/form-control/clear-control/clear-control.component';

@NgModule({
  declarations: [
    AlertDwfeComponent,
    DatePickerDwfeComponent,
    InputEmailDwfeComponent,
    InputPasswordDwfeComponent,
    InputTextDwfeComponent,
    SelectDwfeComponent,
    SlideToggleDwfeComponent,
    ClearControlDwfeComponent,
    PageNotFoundDwfeComponent,
    SpinnerDottedHorizontalDwfeComponent,
    SpinnerSharkFinCircleDwfeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatDividerModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AlertDwfeComponent,
    DatePickerDwfeComponent,
    InputEmailDwfeComponent,
    InputPasswordDwfeComponent,
    InputTextDwfeComponent,
    SelectDwfeComponent,
    SlideToggleDwfeComponent,
    ClearControlDwfeComponent,
    PageNotFoundDwfeComponent,
    SpinnerDottedHorizontalDwfeComponent,
    SpinnerSharkFinCircleDwfeComponent,

    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatDividerModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatDividerModule,
  ]
})
export class DwfeModule {
}
