import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatDialogModule} from '@angular/material';

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
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatButtonModule,
    MatDialogModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule,
  ],
  entryComponents: [
    PageAuthtionLoginComponent
  ],
  providers: [
    AuthtionService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
