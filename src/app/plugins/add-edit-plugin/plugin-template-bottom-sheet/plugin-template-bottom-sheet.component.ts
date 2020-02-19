import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { ApiService } from '~/services/api';
import { L2 } from 'l2-lib/L2';

@Component({
  selector: 'app-plugin-template-bottom-sheet',
  templateUrl: './plugin-template-bottom-sheet.component.html',
  styleUrls: ['./plugin-template-bottom-sheet.component.css']
})
export class PluginTemplateBottomSheetComponent implements OnInit {

  constructor(public api: ApiService,public bottomSheetRef: MatBottomSheetRef<PluginTemplateBottomSheetComponent>) { }

  ngOnInit() {
  }


  newGuid(): Promise<string> {
    return this.api.util
      .newGuid()
      .catch(e => {
        L2.handleException(e);
        throw e;
      });
  }

  async selectTemplate(templateName: 'basic-servermethod' | 'basic-execution' | 'basic-bgthread') {
    if (!navigator.clipboard) {
      L2.exclamation("Your browser does not support the async clipboard API.");
      return;
    }

    let template: string = null;
    this.bottomSheetRef.dismiss();

    if (templateName == "basic-servermethod") {
      let g = await this.newGuid();

      template = `using jsdal_plugin;

[PluginData("Plugin name","${g}"/*unique identifier*/, "A short description")]
class MyServerMethodPlugin : ServerMethodPlugin
{
\t// Create local public methods and decorate with the ServerMethod attribute to export
\t[ServerMethod]
\tpublic string Test() // execute in the browser with: DAL.ServerMethods.Test().exec().then(function(r) { console.log("result", r); });
\t{
\t\treturn "Hello world!";
\t}
}`;

    }
    else if (templateName == "basic-execution") {
      template = `TODO: EXECUTION`;
    }
    else if (templateName == "basic-bgthread") {
      template = `TODO: BG THREAD`;
    }

    if (template != null) {
      this.copyTemplateToClipboard(template);
    }
  }

  copyTemplateToClipboard(template: string) {
    navigator.clipboard
      .writeText(template)
      .then(() => L2.success("Template copied to clipboard"), (err) => L2.exclamation(err))
      .catch(e => L2.exclamation(e));
  }

}
