import { Component, trigger, state, style, transition, animate } from '@angular/core'
import { Location } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'

import * as L2 from '../L2'

// @Component({
//     template: `
//     <router-outlet></router-outlet>
//   `
// })
// export class ProjectsContainer { }

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
        let $content = $(`<div class="form-group">
    <label for="newProjectName">Name</label>
    <input type="text" class="form-control" id="newProjectName" placeholder="Name" value="${project.Name}" >
</div>`);

        BootstrapDialog.show({
            title: 'Edit project',
            message: $content,
            buttons: [{
                label: 'Update',
                cssClass: 'btn-primary',
                action: (dialogItself) => {
                    this.updateProject(project.Name, $content.find("#newProjectName").val()).then((txt) => {
                        if (txt == null || txt == "null") {
                            dialogItself.close();
                        }
                    });
                }
            }
                , {
                label: 'Cancel',
                action: function (dialogItself) { dialogItself.close(); }
            }]

        });
    }

    onCreateNewProjectClicked() {

        let $content = $(`<div class="form-group">
    <label for="newProjectName">Name</label>
    <input type="text" class="form-control" id="newProjectName" placeholder="Name">
</div>`);

        BootstrapDialog.show({
            title: 'Create new project',
            message: $content,
            //message: $("#createNewProjectDialog"),
            buttons: [{
                label: 'Create',
                cssClass: 'btn-primary',
                action: (dialogItself) => {
                    this.createNewProject($content.find("#newProjectName").val()).then((txt) => {
                        if (txt == null || txt == "null") {
                            dialogItself.close();
                        }
                    });
                }
            }
                , {
                label: 'Cancel',
                action: function (dialogItself) { dialogItself.close(); }
            }]

        });
    }

    onDeleteProject(row) {
        BootstrapDialog.show({
            title: 'Confirm action',
            message: `Are you sure you want to delete the project <strong>${row.Name}</strong>?`,
            buttons: [{
                label: 'Delete',
                cssClass: 'btn-primary',
                hotkey: 13,
                action: (dialogItself) => {
                    this.deleteProject(row.Name).then(() => dialogItself.close());
                }
            }
                , {
                label: 'Cancel',
                action: function (dialogItself) { dialogItself.close(); }
            }]

        });
    }

    private deleteProject(name: string): Promise<any> {
        return L2.deleteJson("/api/project", { body: JSON.stringify(name) }).then(r => {
            L2.Success(`Project <strong>${name}</strong> successfully removed.`);
            this.refresh();
        });
    }

    private updateProject(name: string, newName: string): Promise<any> {
        return L2.putJson(`/api/project/${name}`, {
            body: JSON.stringify(newName)
        }).then((r) => {
            L2.Success(`Project <strong>${newName}</strong> successfully updated.`);
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