import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from '~/services/api';
import { L2 } from 'l2-lib/L2';
import { CsharpTextareaComponent } from '~/controls/csharp-textarea/csharp-textarea.component';

@Component({
  selector: 'server-methods-tab',
  templateUrl: './server-methods.component.html',
  styleUrls: ['./server-methods.component.css']
})
export class ServerMethodsComponent implements OnInit {

  editorVisible: boolean = false;
  compilationError: string = null;

  serverMethods: { Id: string, Name: string, Description: string, IsValid: boolean }[];

  @ViewChild('ce') csharpEditor: CsharpTextareaComponent;

  constructor(public api: ApiService) { }

  ngOnInit() {
    this.refreshList();
  }

  getValue(): string {
    if (this.csharpEditor == null) return null;
    return this.csharpEditor.getValue();
  }

  delete(row) {
    L2.confirm(`Are you sure you which to delete this server method '${row.Name}'?`, "Confirm action").then(r => {
      if (r) {
        this.api.app.serverMethods.delete(row.Id).then(r => {
          L2.success("Server method deleted successfully");
          this.refreshList();
        });
      }
    });
  }

  onAddNew() {
    this.editorVisible = true;
  }

  onCancelEditor() {
    this.editorVisible = false;
  }

  refreshList() {
    this.api.app.serverMethods.getList().then(r => {
      this.serverMethods = r;
    });
  }

  saveChanges() {

    //TODO: determine mode, NEW or existing Id?

    this.compilationError = null;

    this.api.app.serverMethods.addUpdate(null, this.getValue()).then(r => {

      if (r) {
        this.compilationError = r.CompilationError;
      }

      if (!r || !r.CompilationError) {
        L2.success("Server method changes saved successfully");
      }

    });
  }

}
