import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {AppComponent} from './app.component';
import {BodyHeaderComponent} from './body/header/header.component';
import {BodyMainComponent} from './body/main/main.component';
import {BodyFooterComponent} from './body/footer/footer.component';
import {PageHomeComponent} from './pages/home/page-home.component';

import {AppRoutingModule} from './app-routing.module';

import {AuthtionModule} from '../dwfe/modules/authtion/authtion.module';
import {AuthtionService} from '../dwfe/modules/authtion/services/authtion.service';

@NgModule({
  declarations: [
    AppComponent,
    BodyHeaderComponent,
    BodyMainComponent,
    BodyFooterComponent,
    PageHomeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AuthtionModule,
  ],
  providers: [
    AuthtionService,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
