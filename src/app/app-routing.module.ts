import {NgModule} from '@angular/core';
import {PageLoginComponent} from './page/login/page-login.component';
import {RouterModule, Routes} from '@angular/router';
import {PageHomeComponent} from './page/home/page-home.component';

const appRoutes: Routes = [
  {path: '', component: PageHomeComponent},
  {path: 'login', component: PageLoginComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
