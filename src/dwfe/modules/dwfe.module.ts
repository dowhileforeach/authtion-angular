import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MatButtonModule, MatDialogModule, MatDividerModule, MatInputModule} from '@angular/material';

import {AlertDwfeComponent} from '../components/alert/alert.component';
import {InputEmailDwfeComponent} from '../components/form-control/input-email/input-email.component';
import {InputPasswordDwfeComponent} from '../components/form-control/input-password/input-password.component';
import {PageNotFoundDwfeComponent} from '../components/page-not-found/page-not-found.component';
import {SpinnerDottedHorizontalDwfeComponent} from '../components/spinner/spinner-dotted-horizontal/spinner-dotted-horizontal.component';
import {SpinnerSharkFinCircleDwfeComponent} from '../components/spinner/spinner-shark-fin-circle/spinner-shark-fin-circle.component';

@NgModule({
  declarations: [
    AlertDwfeComponent,
    InputEmailDwfeComponent,
    InputPasswordDwfeComponent,
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
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    AlertDwfeComponent,
    InputEmailDwfeComponent,
    InputPasswordDwfeComponent,
    PageNotFoundDwfeComponent,
    SpinnerDottedHorizontalDwfeComponent,
    SpinnerSharkFinCircleDwfeComponent,

    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatInputModule,
  ]
})
export class DwfeModule {
}
