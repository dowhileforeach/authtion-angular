import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {BodyHeaderComponent} from './body/header/header.component';
import {BodyMainComponent} from './body/main/main.component';
import {BodyFooterComponent} from './body/footer/footer.component';
import {PageHomeComponent} from './pages/home/page-home.component';
import {PageNotFoundComponent} from './pages/not-found/page-not-found.component';

import {AppRoutes} from './app.routes';

import {AuthtionModule} from '@dwfe/modules/authtion/authtion.module';
import {AuthtionService} from '@dwfe/modules/authtion/services/authtion.service';
import {AuthGuardService} from './auth-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    BodyHeaderComponent,
    BodyMainComponent,
    BodyFooterComponent,
    PageHomeComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutes,
    AuthtionModule,
  ],
  providers: [
    AuthtionService, AuthGuardService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
