import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {
  MatButtonModule,
  MatDialogModule,
  MatDividerModule,
  MatInputModule,
  MatSlideToggleModule,
  MatTooltipModule
} from '@angular/material';

import {AlertDwfeComponent} from '@dwfe/components/alert/alert.component';
import {InputEmailDwfeComponent} from '@dwfe/components/form-control/input-email/input-email.component';
import {InputPasswordDwfeComponent} from '@dwfe/components/form-control/input-password/input-password.component';
import {InputTextDwfeComponent} from '@dwfe/components/form-control/input-text/input-text.component';
import {PageNotFoundDwfeComponent} from '@dwfe/components/page-not-found/page-not-found.component';
import {SpinnerDottedHorizontalDwfeComponent} from '@dwfe/components/spinner/spinner-dotted-horizontal/spinner-dotted-horizontal.component';
import {SpinnerSharkFinCircleDwfeComponent} from '@dwfe/components/spinner/spinner-shark-fin-circle/spinner-shark-fin-circle.component';
import {SlideToggleDwfeComponent} from '@dwfe/components/form-control/slide-toggle/slide-toggle.component';

@NgModule({
  declarations: [
    AlertDwfeComponent,
    InputEmailDwfeComponent,
    InputPasswordDwfeComponent,
    InputTextDwfeComponent,
    SlideToggleDwfeComponent,
    PageNotFoundDwfeComponent,
    SpinnerDottedHorizontalDwfeComponent,
    SpinnerSharkFinCircleDwfeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatInputModule,
    MatSlideToggleModule,
    MatTooltipModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AlertDwfeComponent,
    InputEmailDwfeComponent,
    InputPasswordDwfeComponent,
    InputTextDwfeComponent,
    SlideToggleDwfeComponent,
    PageNotFoundDwfeComponent,
    SpinnerDottedHorizontalDwfeComponent,
    SpinnerSharkFinCircleDwfeComponent,

    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatInputModule,
    MatSlideToggleModule,
    MatTooltipModule,
  ]
})
export class DwfeModule {
}
