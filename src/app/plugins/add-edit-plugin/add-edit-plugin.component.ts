import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { L2 } from 'l2-lib/L2';
import { ApiService } from '~/services/api';
import { CsharpTextareaComponent } from '~/controls/csharp-textarea/csharp-textarea.component';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { PluginTemplateBottomSheetComponent } from './plugin-template-bottom-sheet/plugin-template-bottom-sheet.component';

@Component({
  selector: 'app-add-edit-plugin',
  templateUrl: './add-edit-plugin.component.html',
  styleUrls: ['./add-edit-plugin.component.css']
})
export class AddEditPluginComponent implements OnInit {

  id: string;
  name: string;
  description: string;

  isWorking: boolean = false;
  compilationError: string = null;

  @ViewChild('ce', { static: false }) csharpEditor: CsharpTextareaComponent;

  constructor(public activatedRoute: ActivatedRoute,
    public router: Router,
    public location: Location,
    public api: ApiService,
    private templateBottomSheet: MatBottomSheet

  ) {
    this.activatedRoute.params.subscribe(params => {
      this.id = params["id"];

    });
  }

  ngOnInit() {
  }

  saveChanges() {
    this.compilationError = null;
    this.isWorking = true;

    let body = this.csharpEditor.getValue();

    this.api.app.plugins
      .addUpdateInline(this.id, this.name, this.description, body)
      .then(r => {
        this.isWorking = false;
        console.info("got here!", r);
        if (!r) return;

        this.compilationError = r.CompilationError;
        this.id = r.id;

        //this.router.navigate([`./plugins/edit/${this.id}`]);
        this.location.go(`./plugins/edit/${this.id}`);
        ///this.refreshList();
        L2.success("Changes saved successfully");

      }).catch(e => {
        if (!e.handled) {
          L2.handleException(e);
        }
        this.isWorking = false;
      });
  }

  onCancelEditor() {
    this.router.navigate(['/plugins']);
  }


  openTemplateSelector(): void {
    this.templateBottomSheet.open(PluginTemplateBottomSheetComponent);
  }

}