import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthtionService} from '@dwfe/modules/authtion/services/authtion.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(protected auth: AuthtionService,
              protected router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const loginPath = '/login';
    return new Promise((resolve) => {
      const subscription = this.auth.isLoggedIn$.subscribe(isLoggedIn => {
        if (isLoggedIn) {
          if (state.url === loginPath) {
            this.router.navigate(['/']);
          }
          resolve(true);
        } else {
          if (state.url === loginPath) {
            resolve(true);
          } else {
            this.auth.redirectUrl = state.url;
            this.router.navigate([loginPath]);
            resolve(false);
          }
        }
      });
      subscription.unsubscribe();
    });
    // if 'reject' is used then you may have to use 'catch', for more detail:
    // https://stackoverflow.com/questions/42592903/canactivate-promiseboolean-does-not-navigatebyurl-after-reject
  }
}
