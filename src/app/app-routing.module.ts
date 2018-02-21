import {NgModule} from '@angular/core';
import {PageLogonComponent} from './page/logon/logon.component';
import {RouterModule, Routes} from '@angular/router';
import {PageHomeComponent} from './page/home/home.component';

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
