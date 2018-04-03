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
import {ButtonAuthtionComponent} from './buttons/button-authtion/button-authtion.component';
import {ButtonNotAuthenticatedComponent} from './buttons/button-authtion/button-not-authenticated/button-not-authenticated.component';
import {ButtonLoggedInComponent} from './buttons/button-authtion/button-logged-in/button-logged-in.component';
import {PageAuthtionLoginComponent} from './pages/page-authtion-login/page-authtion-login.component';

import {RecaptchaModule} from 'ng-recaptcha';
import {RecaptchaFormsModule} from 'ng-recaptcha/forms';
import { InputEmailAuthtionComponent } from './inputs/input-email-authtion/input-email-authtion.component';
import {UtilsService} from './utils.service';
import { InputPasswordAuthtionComponent } from './inputs/input-password-authtion/input-password-authtion.component';

@NgModule({
  declarations: [
    AppComponent,
    BodyHeaderComponent,
    BodyMainComponent,
    BodyFooterComponent,
    PageHomeComponent,
    ButtonAuthtionComponent,
    ButtonNotAuthenticatedComponent,
    ButtonLoggedInComponent,
    PageAuthtionLoginComponent,
    InputEmailAuthtionComponent,
    InputPasswordAuthtionComponent,
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
    UtilsService,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
