import { Component, trigger, state, style, transition, animate } from '@angular/core'
import { Location } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'

import * as L2 from '../L2'

@Component({
    templateUrl: './project-list.component.html',
    animations: [
        trigger('componentState', [
            state('void', style({ opacity: 1, transform: 'translateX(-100%)' })),
            state('enterComponent', style({ opacity: 1, transform: 'translateX(0) scale(1)', display: "block" })),
            state('childRouteActive', style({ opacity: 1.0, transform: 'scale(1)', display2: "none" })),
            state('exitComponent', style({ opacity: 0.5, transform: 'translateX(-100%)' })),
            transition('* => enterComponent', animate('300ms ease-in')),
            transition('enterComponent => childRouteActive', animate('500ms ease-in')),
            transition('enterComponent => exitComponent', animate('150ms ease-in'))

        ]),

    ],
})
export class ProjectListComponent {
    private componentState = "enterComponent";

    private projectList: any;
    private selectedProject: any;

    constructor(private route: ActivatedRoute, private router: Router, private location: Location) {
        this.refresh();

        this.route.params.subscribe(params => {
            this.componentState = "enterComponent";
        });
    }

    onEditProject(project) {

      L2.Prompt("Update project", "Name", project.Name, "UPDATE").then((projectName: string) => {
            if (projectName) {
                this.updateProject(project.Name, projectName.trim());
            }
        });
    }

    onCreateNewProjectClicked() {
        L2.Prompt("Create new project", "Name", null, "CREATE").then((projectName: string) => {
            if (projectName) {
                this.createNewProject(projectName.trim());
            }
        });
    }

    onDeleteProject(row) {
        L2.Confirm(`Are you sure you want to delete the project <strong>${row.Name}</strong>?`, "Confirm action").then(r => {
            if (r) this.deleteProject(row.Name);
        });
    }

    private deleteProject(name: string): Promise<any> {
        return L2.deleteJson("/api/project", { body: JSON.stringify(name) }).then(r => {
            L2.Success(`Project ${name} successfully removed.`);
            this.refresh();
        });
    }

    private updateProject(name: string, newName: string): Promise<any> {
        return L2.putJson(`/api/project/${name}`, {
            body: JSON.stringify(newName)
        }).then((r) => {
            L2.Success(`Project ${newName} successfully updated.`);
            this.refresh();
        });
    }

    private createNewProject(name: string): Promise<any> {

        return L2.postJson("/api/project", {
            body: JSON.stringify(name)
        }).then((r) => {
            L2.Success(`Project <strong>${name}</strong> successfully created.`);
            this.refresh();
        });
    }

    refresh() {

        L2.fetchJson("/api/project").then((json: any) => {
            this.projectList = json.Data;
        });

    }
}