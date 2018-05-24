import { Injectable } from '@angular/core';
import { Router, Resolve, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { ProjectService, IDBSource } from './../projects.service';

@Injectable()
export class ApplicationRouteResolver implements Resolve<IDBSource> {
    constructor(private projectService: ProjectService, private router: Router) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {

        let project = route.params["project"];
        let app = route.params['dbSource'];

        return this.projectService.getApp(project, app).then(app => {
            if (app) {
                return app;
            }
            else {
                this.router.navigate(['/']); // TODO: Route back to project list with error?
                return null;
            }
        }).catch(e => {
            console.log("bailing because of error", e);
            this.router.navigate(['/']);     // TODO: Route back to project list with error?
            return null;
        });
    }
}
