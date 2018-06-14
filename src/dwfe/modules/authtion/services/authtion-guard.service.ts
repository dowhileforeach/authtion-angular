import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

import {Observable} from 'rxjs';

import {AuthtionService} from './authtion.service';

@Injectable()
export class AuthtionGuardService implements CanActivate {

  constructor(protected authtionService: AuthtionService,
              protected router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const loginPath = '/login';
    return new Promise((resolve) => {
      const subscription = this.authtionService.isLoggedIn$.subscribe(isLoggedIn => {
        if (isLoggedIn) {
          if (state.url === loginPath) {
            this.router.navigate(['/']);
          }
          resolve(true);
        } else {
          if (state.url === loginPath) {
            resolve(true);
          } else {
            this.authtionService.redirectUrl = state.url;
            this.router.navigate([loginPath]);
            resolve(false);
          }
        }
      });
      setTimeout(() =>
          subscription.unsubscribe()
        , 100); // setTimeout just in case
    });
    // if 'reject' is used then you may have to use 'catch', for more detail:
    // https://stackoverflow.com/questions/42592903/canactivate-promiseboolean-does-not-navigatebyurl-after-reject
  }
}
