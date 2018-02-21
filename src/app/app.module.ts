import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AuthButtonComponent} from './auth-button/auth-button.component';
import {PageLogonComponent} from './page/logon/logon.component';
import {FormsModule} from '@angular/forms';
import {PageHomeComponent} from './page/home/home.component';
import {AppRoutingModule} from './app-routing.module';
import {BodyFooterComponent} from './body/footer/footer.component';
import {BodyMainComponent} from './body/main/main.component';
import {BodyHeaderComponent} from './body/header/header.component';

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
