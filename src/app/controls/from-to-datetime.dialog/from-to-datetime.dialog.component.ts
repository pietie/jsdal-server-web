import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-from-to-datetime.dialog',
  templateUrl: './from-to-datetime.dialog.component.html',
  styleUrls: ['./from-to-datetime.dialog.component.css']
})
export class FromToDatetimeDialogComponent implements OnInit {


  from;
  to;
  constructor() { }

  ngOnInit(): void {

  }

  get fromMoment()
  {
    return window["moment"](this.from);
  }

  get toMoment()
  {
    return window["moment"](this.to);
  }

}


