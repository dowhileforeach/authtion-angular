import {NgModule} from '@angular/core';
import {LogonPageComponent} from './page-logon/logon-page.component';
import {RouterModule, Routes} from '@angular/router';
import {HomePageComponent} from './body-main/main-page/main-page.component';

const appRoutes: Routes = [
  {path: 'logon', component: LogonPageComponent},
  {path: '', component: HomePageComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
