import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageHomeComponent} from './page/home/page-home.component';

const appRoutes: Routes = [
  {path: '', component: PageHomeComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
