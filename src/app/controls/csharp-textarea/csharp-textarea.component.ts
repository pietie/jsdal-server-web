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

  @ViewChild('ta') textarea: ElementRef;


  constructor() { }

  getValue(): string {
    if (this.mirrorsharpRef == null) return null;

    return  this.mirrorsharpRef.getCodeMirror().getValue();
  }

  ngOnInit() {
    this.mirrorsharpRef = mirrorsharp(this.textarea.nativeElement, {
      serviceUrl: 'wss://jsdal.europassistance.co.za:443/mirrorsharp', //TODO: make url configurable!
      forCodeMirror: { lineNumbers: true, theme: 'cobalt' }
    });

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
