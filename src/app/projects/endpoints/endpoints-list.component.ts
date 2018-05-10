import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { L2 } from 'l2-lib/L2';

@Component({
    selector: 'endpoint-list',
    templateUrl: './endpoints-list.component.html'
})
export class EndpointListComponent {
    public endpoints: any[];// = [{ Name: "End point 001", Key: "12345" }, { Name: "End point 002", Key: "56756757" }];

    projectName: string;
    dbSourceName: string;

    constructor(public route: ActivatedRoute) {
        try {
            this.route.data.subscribe((d: any) => {
                this.projectName = this.route.snapshot.params['project'];
                this.dbSourceName = d.dbSource.Name;

                this.refreshEndpoints();
            });


        }
        catch (e) {
            L2.handleException(e);
        }
    }



    refreshEndpoints() {
        L2.fetchJson(`/api/endpoint?project=${this.projectName}&dbSourceName=${this.dbSourceName}`).then((r: any) => {
            this.endpoints = r.Data;
        });
    }

    onEdit(row) {
        L2.prompt("Update endpoint", "Name", row.Name, "UPDATE").then((newName: string) => {
            if (newName) {
                this.updateEndpoint(row.Name, newName.trim());
            }
        });
    }

    onCreateNew() {
        L2.prompt("Create new endpoint", "Name", null, "CREATE").then((name: string) => {
            if (name) {
                this.createNewEndpoint(name.trim());
            }
        });
    }

    onDelete(row) {
        L2.confirm(`Are you sure you want to delete the endpoint <strong>${row.Name}</strong>?`, "Confirm action").then(r => {
            if (r) {
                this.deleteEndpoint(row.Name);
            }
        });
    }

    private createNewEndpoint(name: string) {
        return L2.postJson(`/api/endpoint/${name}?project=${this.projectName}&dbSourceName=${this.dbSourceName}`, {
            
        }).then((r) => {
            L2.success(`Endpoint '${name}' successfully updated.`);
            this.refreshEndpoints();
        });

    }

    private updateEndpoint(oldName: string, newName: string): Promise<any> {
        return L2.putJson(`/api/endpoint/${oldName}?project=${this.projectName}&dbSourceName=${this.dbSourceName}`, {
            body: JSON.stringify(newName)
        }).then((r) => {
            L2.success(`Endpoint '${newName}' successfully updated.`);
            this.refreshEndpoints();
        });
    }

    private deleteEndpoint(name: string) {
        return L2.deleteJson(`/api/endpoint/${name}?project=${this.projectName}&dbSourceName=${this.dbSourceName}`).then((r) => {
            L2.success(`Endpoint '${name}' successfully deleted.`);
            this.refreshEndpoints();
        });
    }
}