import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import * as mirrorsharp from 'mirrorsharp';


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

  constructor() {


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
    this.mirrorsharpRef = mirrorsharp(this.textarea.nativeElement, {
      serviceUrl: 'wss://jsdal.europassistance.co.za:443/mirrorsharp', //TODO: make url configurable!
      forCodeMirror: { lineNumbers: true, theme: 'cobalt' }
    });

    this.codemirrorRef = this.mirrorsharpRef.getCodeMirror();

    // let actualTextarea: HTMLTextAreaElement = <HTMLTextAreaElement>ms.getCodeMirror().display.input.textarea;

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
