import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiResponseEndThenChain } from 'l2-lib/dist/L2';
import { ApiService } from '~/services/api';

@Injectable({
  providedIn: 'root'
})
export class JsdalConfigLoadedGuard implements CanActivate {

  constructor(public api: ApiService)
  {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      return this.api.jsDALConfig$.then(r=>true);
  }

}
