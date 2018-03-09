import {Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fromEpoch', pure: true
})
export class FromEpochPipe implements PipeTransform {
    transform(value: string, args: any[]) {
        if (value) {
            var d = new Date(0); 
            d.setUTCMilliseconds(parseInt(value));
            return d;
        }
        return null;
    }
}  

