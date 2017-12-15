import { Component } from '@angular/core';

@Component({
    templateUrl: './plugins.component.html'
})
export class PluginsComponent
{
    text: string;
    options:any = {maxLines: 1000, printMargin: false};
    constructor()
    {

    }

    onChange(code) {
       // console.log("new code", code);
    }
}