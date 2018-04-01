import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BodyHeaderComponent} from './body/header/header.component';
import {BodyMainComponent} from './body/main/main.component';
import {BodyFooterComponent} from './body/footer/footer.component';
import {PageLoginComponent} from './page/login/page-login.component';
import {PageHomeComponent} from './page/home/page-home.component';
import {ButtonAuthtionComponent} from './button/button-authtion/button-authtion.component';
import {FormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatDialogModule} from '@angular/material';
import {RecaptchaModule} from 'ng-recaptcha';
import {RecaptchaFormsModule} from 'ng-recaptcha/forms';
import {AuthtionService} from './authtion.service';
import {ButtonNotAuthenticatedComponent} from './button/button-authtion/button-not-authenticated/button-not-authenticated.component';
import {ButtonLoggedInComponent} from './button/button-authtion/button-logged-in/button-logged-in.component';

@NgModule({
  declarations: [
    AppComponent,
    BodyHeaderComponent,
    BodyMainComponent,
    BodyFooterComponent,
    PageLoginComponent,
    PageHomeComponent,
    ButtonAuthtionComponent,
    ButtonNotAuthenticatedComponent,
    ButtonLoggedInComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    MatButtonModule,
    MatDialogModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule
  ],
  providers: [AuthtionService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
