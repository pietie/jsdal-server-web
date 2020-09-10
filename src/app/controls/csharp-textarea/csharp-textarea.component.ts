import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import * as mirrorsharp from 'mirrorsharp';
import { L2 } from 'l2-lib/L2';
import { ApiService } from '~/services/api';



@Component({
  selector: 'csharp-textarea',
  templateUrl: './csharp-textarea.component.html',
  styleUrls: ['./csharp-textarea.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CsharpTextareaComponent implements OnInit {

  private mirrorsharpRef: any;
  private codemirrorRef: any;

  @ViewChild('ta', { static: true }) textarea: ElementRef;

  private _disabled: boolean = false;

  @Input()
  set disabled(val: boolean) {
    this._disabled = val;

    if (this.codemirrorRef && val != this.codemirrorRef.options.readOnly) {
      this.codemirrorRef.options.readOnly = val;
    }
  }

  get disabled(): boolean { return this._disabled; }

  constructor(public api:ApiService) {


  }

  getValue(): string {
    if (this.mirrorsharpRef == null) return null;

    return this.mirrorsharpRef.getCodeMirror().getValue();
  }

  setValue(val: string) {
    if (this.mirrorsharpRef == null) return null;
    return this.mirrorsharpRef.getCodeMirror().setValue(val);
  }

  ngOnInit() {

    try {
      let apiBaseUrl = this.api.apiBaseUrl.replace(/^((https|http):\/\/)/gmi, "");

      this.mirrorsharpRef = mirrorsharp.default(this.textarea.nativeElement, {
        serviceUrl: `wss://${apiBaseUrl}:443/mirrorsharp`,
        forCodeMirror: { lineNumbers: true, theme: 'cobalt' }
      });

      this.codemirrorRef = this.mirrorsharpRef.getCodeMirror();
    }
    catch (e) {
      //L2.handleException(e);
      console.error(e);
    }

    // let actualTextarea: HTMLTextAreaElement = <HTMLTextAreaElement>ms.getCodeMi rror().display.input.textarea;

    // //let ta: HTMLTextAreaElement = <HTMLTextAreaElement>this.textarea.nativeElement;

    // window["ms"] = ms;
    // console.log("ms ", ms);

    // console.log("actualTextarea ", actualTextarea);

    // // ta.addEventListener("input", () => {
    // //   console.log("input\t", ta.value);
    // // });

    // actualTextarea.addEventListener("change", () => {
    //   console.log("!!!\t", actualTextarea.value);

    // });
  }

}
