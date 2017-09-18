import { Component } from '@angular/core'
import { Location } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'

import { trigger, state, style, transition, animate } from '@angular/animations';

import { L2  } from 'l2-lib/L2';

@Component({
    templateUrl: './project-list.component.html',
    animations: [
        trigger('componentState', [
            state('void', style({ opacity: 1, transform: 'translateX(-100%)' })),
            state('enterComponent', style({ opacity: 1, transform: 'translateX(0) scale(1)', display: "block" })),
            state('childRouteActive', style({ opacity: 1.0, transform: 'scale(1)' })),
            state('exitComponent', style({ opacity: 0.5, transform: 'translateX(-100%)' })),
            transition('* => enterComponent', animate('300ms ease-in')),
            transition('enterComponent => childRouteActive', animate('500ms ease-in')),
            transition('enterComponent => exitComponent', animate('150ms ease-in'))

        ]),

    ],
})
export class ProjectListComponent {
    public componentState = "enterComponent";

    public projectList: any;
    public selectedProject: any;

    constructor(public route: ActivatedRoute, public router: Router, public location: Location) {
        this.refresh();

        this.route.params.subscribe(params => {
            console.log("project-list.component",route);
            this.componentState = "enterComponent";
        });
    }

    onEditProject(project) {

        L2.prompt("Update project", "Name", project.Name, "UPDATE").then((projectName: string) => {
            if (projectName) {
                this.updateProject(project.Name, projectName.trim());
            }
        });
    }

    onCreateNewProjectClicked() {
        L2.prompt("Create new project", "Name", null, "CREATE").then((projectName: string) => {
            if (projectName) {
                this.createNewProject(projectName.trim());
            }
        });
    }

    onDeleteProject(row) {
        L2.confirm(`Are you sure you want to delete the project <strong>${row.Name}</strong>?`, "Confirm action").then(r => {
            if (r) this.deleteProject(row.Name);
        });
    }

    public deleteProject(name: string): Promise<any> {
        return L2.deleteJson("/api/project", { body: JSON.stringify(name) }).then(r => {
            L2.success(`Project '${name}' successfully removed.`);
            this.refresh();

            let child: any = this.route.firstChild;

            // redirect back up to this level if a child has been deleted
            if (child && child.params.getValue().name == name) {
                this.router.navigate(['./'], { relativeTo: this.route });
            }
        });
    }

    public updateProject(name: string, newName: string): Promise<any> {
        return L2.putJson(`/api/project/${name}`, {
            body: JSON.stringify(newName)
        }).then((r) => {
            L2.success(`Project '${newName}' successfully updated.`);
            this.refresh();
        });
    }

    public createNewProject(name: string): Promise<any> {

        return L2.postJson("/api/project", {
            body: JSON.stringify(name)
        }).then((r) => {
            L2.success(`Project '${name}' successfully created.`);
            this.refresh();
        });
    }

    refresh() {

        L2.fetchJson("/api/project").then((json: any) => {
            this.projectList = json.Data;
        });

    }
}