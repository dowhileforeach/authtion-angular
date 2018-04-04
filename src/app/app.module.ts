import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatDialogModule} from '@angular/material';

import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {BodyHeaderComponent} from './body/header/header.component';
import {BodyMainComponent} from './body/main/main.component';
import {BodyFooterComponent} from './body/footer/footer.component';
import {PageHomeComponent} from './pages/home/page-home.component';
import {AppRoutingModule} from './app-routing.module';

import {AuthtionService} from './authtion.service';
import {AuthtionUtilsService} from './authtion-utils.service';
import {BtnAuthtionUserComponent} from './buttons/btn-authtion__user/btn-authtion__user.component';
import {BtnAuthtionUserNotAuthenticatedComponent} from './buttons/btn-authtion__user/btn-authtion__user--not-authenticated/btn-authtion__user--not-authenticated.component';
import {BtnAuthtionUserLoggedInComponent} from './buttons/btn-authtion__user/btn-authtion__user--logged-in/btn-authtion__user--logged-in.component';
import {InputAuthtionEmailComponent} from './inputs/input-authtion__email/input-authtion__email.component';
import {InputAuthtionPasswordComponent} from './inputs/input-authtion__password/input-authtion__password.component';
import {PageAuthtionLoginComponent} from './pages/page-authtion-login/page-authtion-login.component';

import {RecaptchaModule} from 'ng-recaptcha';
import {RecaptchaFormsModule} from 'ng-recaptcha/forms';

@NgModule({
  declarations: [
    AppComponent,
    BodyHeaderComponent,
    BodyMainComponent,
    BodyFooterComponent,
    PageHomeComponent,
    BtnAuthtionUserComponent,
    BtnAuthtionUserNotAuthenticatedComponent,
    BtnAuthtionUserLoggedInComponent,
    InputAuthtionEmailComponent,
    InputAuthtionPasswordComponent,
    PageAuthtionLoginComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatButtonModule,
    MatDialogModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  entryComponents: [
    PageAuthtionLoginComponent
  ],
  providers: [
    AuthtionService,
    AuthtionUtilsService,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
