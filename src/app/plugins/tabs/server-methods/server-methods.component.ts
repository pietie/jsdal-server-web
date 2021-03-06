import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
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

  serverMethods: { Id: string, InlineEntryId: string, Name: string, IsInline: boolean, IsValid: boolean, Plugins: [{ Name: string, Description: string }] }[];

  currentId: string = null;

  isWorking: boolean = false;

  @ViewChild('ce', { static: false }) csharpEditor: CsharpTextareaComponent;

  constructor(public api: ApiService, public cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.refreshList();
  }

  getValue(): string {
    if (this.csharpEditor == null) return null;
    return this.csharpEditor.getValue();
  }

  // edit(row) {

  //   this.isWorking = true;

  //   this.api.app.serverMethods
  //     .getSource(row.Id)
  //     .then(source => {
  //       this.isWorking = false;
  //       this.currentId = row.Id;
  //       this.editorVisible = true;
  //       // without timeout ng does not update view immediately :/
  //       setTimeout(() => {
  //         this.csharpEditor.setValue(source);
  //       }, 0);
  //     }).catch(e => {
  //       L2.handleException(e);
  //       this.isWorking = false;
  //     });
  // }

  delete(row) {
    // this.isWorking = true;
    // L2.confirm(`Are you sure you want to delete the module '${row.Id}'?`, "Confirm action")
    //   .then(r => {
    //     this.isWorking = false;
    //     if (r) {
    //       this.api.app.serverMethods.delete(row.Id).then(r => {
    //         L2.success("Server method deleted successfully");
    //         this.refreshList();
    //       });
    //     }
    //   }).catch(e => {
    //     L2.handleException(e);
    //     this.isWorking = false;
    //   });
  }

  onAddNew() {
    this.editorVisible = true;
    this.currentId = null;
  }

  onCancelEditor() {
    this.editorVisible = false;
    this.currentId = null;
  }

  refreshList() {
    this.api.app.serverMethods
      .getList()
      .then(r => {
        this.serverMethods = r;
      });
  }

  saveChanges() {

    // // this.compilationError = null;
    // // this.isWorking = true;

    // // this.api.app.serverMethods.addUpdate(this.currentId, this.getValue())
    // //   .then(r => {
    // //     this.isWorking = false;
    // //     if (r && r.CompilationError && !r.id) {
    // //       this.compilationError = r.CompilationError;
    // //     }

    // //     else {
    // //       this.currentId = r.id;
    // //       this.refreshList();
    // //       L2.success("Server method changes saved successfully");
    // //     }
    // //   }).catch(e => {
    // //     L2.handleException(e);
    // //     this.isWorking = false;
    // //   });
  }

  newGuid(): Promise<string> {
    return this.api.util.newGuid()
      .then(g => {
        //console.log(g);
        // if (!navigator.clipboard) {
        //   L2.exclamation("Your browser does not support the async clipboard API. See debug console (press F12) for Guid output.");
        //   return;
        // }
        // navigator.clipboard.writeText(g).then(function () {
        //   L2.success("New Guid copied to clipboard.");
        // }, function (err) {
        //   L2.exclamation(err);
        // });
        return g;
      })
      .catch(e => {
        L2.handleException(e);
        throw e;
      });
  }

  basicTemplate() {

    this.isWorking = true;

    this.newGuid().then(g => {
      this.isWorking = false;
      let template = `using jsdal_plugin;\r\n\r\n[PluginData("Plugin name","${g}", "A short description")]\r\nclass MyServerMethodPlugin : ServerMethodPlugin\r\n{\r\n\t// Create local public methods and decorate with the ServerMethod attribute to export.\r\n\t[ServerMethod]\r\n\tpublic string Test() // execute in the browser with: DAL.ServerMethods.Test().exec().then(function(r) { console.log("result", r); });\r\n\t{\r\n\t\treturn "Hello world!";\r\n\t}\r\n}`;

      this.csharpEditor.setValue(template);

    }).catch(e => {
      L2.handleException(e);
      this.isWorking = false;
    });


  }


}
