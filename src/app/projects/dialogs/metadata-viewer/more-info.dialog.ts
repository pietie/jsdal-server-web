import { Component } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import L2 from 'l2-lib/L2';

@Component({
    selector: 'more-info.dialog',
    templateUrl: './more-info.dialog.html',
    styles: [`
/deep/ pre {outline: 1px solid #ccc; padding: 5px; margin: 5px; }
/deep/ .string { color: green; }
/deep/ .number { color: darkorange; }
/deep/ .boolean { color: blue; }
/deep/ .null { color: magenta; }
/deep/ .key { color: red; }

    
    `]
})
export class MetadataMoreInfoDialog {

    title: string;
    dataContext: any;
    mode: "Unknown" | "Parms" | "ResultSet" | "ResultSetError" | "JsDALMetadata" = "Unknown";

    get dataContextKeys() : string[]
    {
        if (this.dataContext == null) return null;
        return Object.keys(this.dataContext);
    }

    constructor(private dialogRef: MdDialogRef<MetadataMoreInfoDialog>) {

    }

    //http://stackoverflow.com/a/7220510
    syntaxHighlight(json) {
        json = JSON.stringify(json, undefined, 4);
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }




}