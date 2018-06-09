import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {PageNotFoundDwfeComponent} from '@dwfe/components/page-not-found/page-not-found.component';

const wildcardRoutes: Routes = [
  {path: '**', component: PageNotFoundDwfeComponent},
];

@NgModule({
  imports: [
    RouterModule.forChild(wildcardRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class WildcardRoutingModule {
}
