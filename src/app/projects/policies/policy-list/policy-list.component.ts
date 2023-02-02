import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { L2 } from 'l2-lib/L2';
import { ApplicationComponent } from '~/projects/application/application.component';
import { ApiService } from '~/services/api';
import { AddEditPolicyDialogComponent } from './add-edit-policy-dialog/add-edit-policy-dialog.component';

@Component({
  selector: 'policy-list',
  templateUrl: './policy-list.component.html',
  styleUrls: ['./policy-list.component.css']
})
export class PolicyListComponent implements OnInit {

  constructor(public dialog: MatDialog, public appComp: ApplicationComponent, public api: ApiService) { }

  loading = false;
  policies;

  async ngOnInit() {
    await this.refresh();
  }

  async refresh() {
    try {

      this.loading = true;
      this.policies = await this.api.app.policies.getExecutionPolicies({ projectName: this.appComp.projectName, appName: this.appComp.dbSource.Name });

    } catch (e) {
      L2.handleException(e);
    }
    finally {
      this.loading = false;
    }
  }

  addPolicy() {
    this.addEdit();
  }

  async onSetDefault(row) {
    try {

      let r = await this.api.app.policies.setDefaultExecPolicy({ projectName: this.appComp.projectName, appName: this.appComp.dbSource.Name, execPolicyId: row.Id });

      this.refresh();

    } catch (e) {
      L2.handleException(e);
    }
  }


  onEdit(row) {
    console.info("editing...", row);
    // edit a copy
    //this.addEdit({ ...row });
    this.addEdit(JSON.parse(JSON.stringify(row)));
  }

  private addEdit(existing = null) {
    try {

      let dialogRef = this.dialog.open(AddEditPolicyDialogComponent, {
        data: { project: this.appComp.projectName, app: this.appComp.dbSource.Name, existing: existing },
        disableClose: true,
        width: "600",
        height: "400"
      });

      dialogRef.afterClosed().subscribe(res => {
        if (res) this.refresh();
      });

    }
    catch (e) {
      L2.handleException(e);
    }
  }

  onDelete(row) {
    L2.confirm(`Are you sure you want to delete the policy <strong>${row.Name}</strong>?`, "Confirm action").then(async r => {
      if (r) {

        let r = await this.api.app.policies.deleteExecPolicy({ projectName: this.appComp.projectName, appName: this.appComp.dbSource.Name, execPolicyId: row.Id });
        this.refresh();
      }
    });
  }

  buildDescription(row) {
    if (!row) return null;
    let ret = `Cmd timeout=${row.CommandTimeoutInSeconds}, Deadlock retry=${row.DeadlockRetry?.Enabled ? "enabled" : "disabled"}`;

    return ret;
  }

}
