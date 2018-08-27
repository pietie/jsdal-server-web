import { Component, ViewEncapsulation } from '@angular/core';
import { L2 } from 'l2-lib/L2';


@Component({
    templateUrl: './plugins.component.html',
    styleUrls: ['./plugins.component.css']
})
export class PluginsComponent {

    hasChangesToCompile: boolean = false;

    text: string;
    options: any = { maxLines: 1000, printMargin: false };

    compilerOutput: any;

    constructor() {

    }

    ngOnInit() {

        
    }

    onChange(code) {
        //console.log("new code", code);
        this.hasChangesToCompile = true;
    }

    testCompile() {
        L2.postJson('/api/util/test-compile', { body: this.text }).then(r => {
            this.compilerOutput = r;
            this.hasChangesToCompile = false;
        });

    }
}