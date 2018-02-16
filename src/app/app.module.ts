import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AuthButtonComponent} from './auth-button/auth-button.component';
import {LogonPageComponent} from './logon-page/logon-page.component';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import { HomePageComponent } from './main-page/home-page.component';

const appRoutes: Routes = [
  {path: 'logon', component: LogonPageComponent},
  {path: '', component: HomePageComponent}
];

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
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
