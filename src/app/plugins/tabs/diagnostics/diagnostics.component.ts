import { Component, OnInit } from '@angular/core';
import { ApiService } from '~/services/api';

@Component({
  selector: 'diagnostics-tab',
  templateUrl: './diagnostics.component.html',
  styleUrls: ['./diagnostics.component.css']
})
export class DiagnosticsComponent implements OnInit {

  diagnostics: any;

  constructor(public api: ApiService) { }

  ngOnInit(): void {

    this.api.app.plugins.getDiagnostics().then(r => this.diagnostics = r);
  }

}
