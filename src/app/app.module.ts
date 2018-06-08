import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';

import {AppComponent} from './app.component';
import {BodyHeaderComponent} from './body/header/header.component';
import {BodyMainComponent} from './body/main/main.component';
import {BodyFooterComponent} from './body/footer/footer.component';
import {PageHomeComponent} from './pages/home/page-home.component';

import {PageNotFoundDwfeComponent} from '@dwfe/components/page-not-found/page-not-found.component';

import {AuthtionModule} from '@dwfe/modules/authtion/authtion.module';
import {authtionRoutes} from '@dwfe/modules/authtion/authtion.routes';

@NgModule({
  declarations: [
    AppComponent,
    BodyHeaderComponent,
    BodyMainComponent,
    BodyFooterComponent,
    PageHomeComponent,
    PageNotFoundDwfeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AuthtionModule,
    RouterModule.forRoot(authtionRoutes),
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {
}
