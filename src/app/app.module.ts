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
import {MatButtonModule} from '@angular/material';
import {AutofocusDirective} from './autofocus.directive';
import {RecaptchaModule} from 'ng-recaptcha';
import {RecaptchaFormsModule} from 'ng-recaptcha/forms';
import {AuthtionService} from './authtion.service';
import { NotAuthenticatedComponent } from './button/button-authtion/not-authenticated/not-authenticated.component';
import { LoggedInComponent } from './button/button-authtion/logged-in/logged-in.component';

@NgModule({
  declarations: [
    AppComponent,
    BodyHeaderComponent,
    BodyMainComponent,
    BodyFooterComponent,
    PageLoginComponent,
    PageHomeComponent,
    ButtonAuthtionComponent,
    AutofocusDirective,
    NotAuthenticatedComponent,
    LoggedInComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    AppRoutingModule,
    MatButtonModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule
  ],
  providers: [AuthtionService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
