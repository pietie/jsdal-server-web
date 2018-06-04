import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rule-addupdate-dialog',
  templateUrl: './rule-addupdate-dialog.component.html',
  styleUrls: ['./rule-addupdate-dialog.component.css']
})
export class RuleAddupdateDialogComponent implements OnInit {

  constructor() { }

  type: number;

  schemaVal: string;
  specificVal: string;
  regexVal: string;
  editMode:boolean = false;

  ngOnInit() {

  }

  initEdit(type: number, value: string) {

    this.type = type;

    if (type == 0/*Schema*/) {
      this.schemaVal = value;
    }
    else if (type == 1/*Specific*/) {
      this.specificVal = value;
    }
    else if (type == 2/*Regex*/) {
      this.regexVal = value;
    }

    this.editMode = true;
  }

  getResult(radSchema, radSpecific, radRegex, txtSchema, txtSpecific, txtRegex) {

    let type: number = 0;
    let value: string = null;

    if (radSchema.checked) {
      type = 0;
      value = txtSchema.value;
    }
    else if (radSpecific.checked) {
      type = 1;
      value = txtSpecific.value;
    }
    else if (radRegex.checked) {
      type = 2;
      value = txtRegex.value;
    }

    return {
      Type: type
      , Value: value
    };
  }

}
