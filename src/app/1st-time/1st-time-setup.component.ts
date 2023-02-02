import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { L2 } from 'l2-lib/L2';
import { ApiService } from '~/services/api';

@Component({
  templateUrl: './1st-time-setup.component.html'
})
export class FirstTimeSetupComponent {
  public adminUser: { username?: string, password?: string, passwordConfirm?: string } = {};

  constructor(public router: Router, public api: ApiService) {

  }

  createAdminUser() {
    if (!this.adminUser.username || this.adminUser.username.trim() == "") {
      L2.exclamation("Please provide a value for username.");
      return;
    }
    if (!this.adminUser.password || this.adminUser.password.trim() == "") {
      L2.exclamation("Please provide a value for password.");
      return;
    }
    if (this.adminUser.password != this.adminUser.passwordConfirm) {
      L2.exclamation("The passwords do not match.");
      return;
    }

    this.api.post(`/api/main/1sttimesetup`, { body: JSON.stringify({ adminUser: this.adminUser }) }).then(r => {
      L2.success("First time setup succesfully completed.");
      this.router.navigate(['/']);
    });


  }
}
