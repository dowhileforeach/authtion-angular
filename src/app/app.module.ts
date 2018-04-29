import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {BodyHeaderComponent} from './body/header/header.component';
import {BodyMainComponent} from './body/main/main.component';
import {BodyFooterComponent} from './body/footer/footer.component';
import {PageHomeComponent} from './pages/home/page-home.component';

import {AuthtionModule} from '../dwfe/modules/authtion/authtion.module';

import {AuthtionService} from '../dwfe/modules/authtion/services/authtion.service';
import {AuthtionUtilsService} from '../dwfe/modules/authtion/services/authtion-utils.service';
import {AuthtionExchangeService} from '../dwfe/modules/authtion/services/authtion-exchange.service';

@NgModule({
  declarations: [
    AppComponent,
    BodyHeaderComponent,
    BodyMainComponent,
    BodyFooterComponent,
    PageHomeComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AuthtionModule
  ],
  providers: [
    AuthtionService,
    AuthtionUtilsService,
    AuthtionExchangeService,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
