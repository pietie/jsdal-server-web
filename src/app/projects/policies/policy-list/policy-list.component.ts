import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { L2 } from 'l2-lib/L2';
import { AddEditPolicyDialogComponent } from './add-edit-policy-dialog/add-edit-policy-dialog.component';

@Component({
  selector: 'policy-list',
  templateUrl: './policy-list.component.html',
  styleUrls: ['./policy-list.component.css']
})
export class PolicyListComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  addPolicy() {
    try {

      let dialogRef = this.dialog.open(AddEditPolicyDialogComponent, { disableClose: true, width: "600", height: "400" });

      dialogRef.afterClosed().subscribe(res => {
        console.log("dialog result", res);
      });

    }
    catch (e) {
      L2.handleException(e);
    }
  }

}
