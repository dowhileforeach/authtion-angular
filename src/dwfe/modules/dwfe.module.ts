import {NgModule} from '@angular/core';

import {AlertDwfeComponent} from '@dwfe/components/alert/alert.component';
import {InputEmailDwfeComponent} from '@dwfe/components/form-control/input-email/input-email.component';
import {InputPasswordDwfeComponent} from '@dwfe/components/form-control/input-password/input-password.component';
import {SpinnerDottedHorizontalDwfeComponent} from '@dwfe/components/spinner/spinner-dotted-horizontal/spinner-dotted-horizontal.component';
import {SpinnerSharkFinCircleDwfeComponent} from '@dwfe/components/spinner/spinner-shark-fin-circle/spinner-shark-fin-circle.component';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatInputModule} from '@angular/material';

@NgModule({
  declarations: [
    AlertDwfeComponent,
    InputEmailDwfeComponent,
    InputPasswordDwfeComponent,
    SpinnerDottedHorizontalDwfeComponent,
    SpinnerSharkFinCircleDwfeComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    MatInputModule,
    MatButtonModule,
  ],
  exports: [
    AlertDwfeComponent,
    InputEmailDwfeComponent,
    InputPasswordDwfeComponent,
    SpinnerDottedHorizontalDwfeComponent,
    SpinnerSharkFinCircleDwfeComponent,
  ]
})
export class DwfeModule {
}
