import {Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fromISODateStr', pure: true
})
export class IsoDatePipe implements PipeTransform {
    transform(value: string, args: any[]) {
        if (value) {
            return new Date(value);
        }
        return null;
    }
}  

