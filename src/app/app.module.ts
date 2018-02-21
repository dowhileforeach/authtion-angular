import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AuthButtonComponent} from './body-header/auth-button/auth-button.component';
import {LogonPageComponent} from './page-logon/logon-page.component';
import {FormsModule} from '@angular/forms';
import {HomePageComponent} from './body-main/main-page/main-page.component';
import {AppRoutingModule} from './app-routing.module';
import { BodyFooterComponent } from './body-footer/body-footer.component';
import { BodyMainComponent } from './body-main/body-main.component';
import { BodyHeaderComponent } from './body-header/body-header.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthButtonComponent,
    LogonPageComponent,
    HomePageComponent,
    BodyFooterComponent,
    BodyMainComponent,
    BodyHeaderComponent,
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
