import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AuthButtonComponent} from './body-header/auth-button/auth-button.component';
import {PageLogonComponent} from './page-logon/page-logon.component';
import {FormsModule} from '@angular/forms';
import {PageHomeComponent} from './body-main/page-home/page-home.component';
import {AppRoutingModule} from './app-routing.module';
import {BodyFooterComponent} from './body-footer/body-footer.component';
import {BodyMainComponent} from './body-main/body-main.component';
import {BodyHeaderComponent} from './body-header/body-header.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthButtonComponent,
    PageLogonComponent,
    PageHomeComponent,
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
