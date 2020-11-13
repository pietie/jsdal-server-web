import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { EndpointDALService, IEndpoint } from '~/projects/endpoints/endpoint-dal.service';

@Injectable()
export class EndpointsDetailRouteResolver implements Resolve<IEndpoint> {
    constructor(private endpointDAL: EndpointDALService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {

        let project = route.parent.params["project"];
        let dbSource = route.parent.params['dbSource'];
        let endpoint = route.params["endpoint"];

        return this.endpointDAL.get(project, dbSource, endpoint).then(ep => {
            if (ep) {
                return { ...ep, app: dbSource, project: project } ;
            }
            else {
                this.router.navigate(['/']); // TODO: Route back to project list with error?
                return null;
            }
        }).catch(e => {
            console.log("EP: bailing because of error", e);
            this.router.navigate(['/']);     // TODO: Route back to project list with error?
            return null;
        });
    }
}
