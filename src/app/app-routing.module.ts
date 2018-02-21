import {NgModule} from '@angular/core';
import {PageLogonComponent} from './page-logon/page-logon.component';
import {RouterModule, Routes} from '@angular/router';
import {PageHomeComponent} from './body-main/page-home/page-home.component';

const appRoutes: Routes = [
  {path: '', component: PageHomeComponent},
  {path: 'logon', component: PageLogonComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
