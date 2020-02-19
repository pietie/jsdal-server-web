import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { L2 } from 'l2-lib/L2';
import { ApiService } from '~/services/api';
import { CsharpTextareaComponent } from '~/controls/csharp-textarea/csharp-textarea.component';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { PluginTemplateBottomSheetComponent } from './plugin-template-bottom-sheet/plugin-template-bottom-sheet.component';
import { Subscription } from 'rxjs';

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

  isNew: boolean = false;

  @ViewChild('ce', { static: false }) csharpEditor: CsharpTextareaComponent;

  sub$: Subscription;

  constructor(public activatedRoute: ActivatedRoute,
    public router: Router,
    public location: Location,
    public api: ApiService,
    private templateBottomSheet: MatBottomSheet

  ) {

  }

  ngOnInit() {
    this.sub$ = this.activatedRoute.params.subscribe(params => {
      this.id = params["id"];
      this.isNew = this.id == undefined || this.id == null;

      if (!this.isNew) {
        this.loadExistingSource(this.id);
      }
    });

  }

  ngOnDestroy(): void {
    if (this.sub$) {
      this.sub$.unsubscribe();
      this.sub$ = null;
    }
  }

  loadExistingSource(id: string) {
    this.isWorking = true;

    this.api.app.plugins
      .getInlineSource(id)
      .then(ret => {
        this.isWorking = false;
        
        this.name = ret.Name;
        this.description = ret.Description;
 
        // without timeout ng does not update view immediately :/
        setTimeout(() => {
          this.csharpEditor.setValue(ret.Source);
        }, 0);

      })
      .catch(e => { this.isWorking = false; L2.handleException(e); })
      ;
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