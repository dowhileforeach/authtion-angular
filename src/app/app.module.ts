import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AuthButtonComponent} from './auth-button/auth-button.component';
import {LogonPageComponent} from './logon-page/logon-page.component';
import {FormsModule} from '@angular/forms';
import {HomePageComponent} from './main-page/home-page.component';
import {AppRoutingModule} from './app-routing.module';


@NgModule({
  declarations: [
    AppComponent,
    AuthButtonComponent,
    LogonPageComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
