import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import {MatInputModule} from '@angular/material';

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
    ReactiveFormsModule,

    MatInputModule,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,

    AlertDwfeComponent,
    InputEmailDwfeComponent,
    InputPasswordDwfeComponent,
    PageNotFoundDwfeComponent,
    SpinnerDottedHorizontalDwfeComponent,
    SpinnerSharkFinCircleDwfeComponent,

    MatInputModule,
  ]
})
export class DwfeModule {
}
