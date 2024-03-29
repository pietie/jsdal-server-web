import { Component, ViewEncapsulation } from '@angular/core';
import { L2 } from 'l2-lib/L2';
import { ApiService } from '~/services/api';


@Component({
  templateUrl: './plugins.component.html',
  styleUrls: ['./plugins.component.css']
})
export class PluginsComponent {

  hasChangesToCompile: boolean = false;

  text: string;
  options: any = { maxLines: 1000, printMargin: false };

  compilerOutput: any;


  constructor(public api: ApiService) {

  }

  ngOnInit() {


  }

  onChange(code) {
    //console.log("new code", code);
    this.hasChangesToCompile = true;
  }

  testCompile() {
    this.api.post('/api/util/test-compile', { body: this.text }).then(r => {
      this.compilerOutput = r;
      this.hasChangesToCompile = false;
    });

  }
}
