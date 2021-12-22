import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsToTime',
  pure: true
})
export class SecondsToTimePipe implements PipeTransform {

  transform(value: number, ...args: any[]): unknown {

    let comp = this.getComponents(value);

    if (args.length > 0 && args[0] == "long") {
      let ret = "";

      if (comp.days > 0) ret += `${(<any>comp).days.toString().padStart(3)} days `;
      if (comp.hours > 0) ret += `${(<any>comp).hours.toString().padStart(2, '0')}h`;

      if (comp.hours > 0 || comp.minutes > 0) ret += `${(<any>comp).minutes.toString().padStart(2, '0')}m`;

      if (comp.hours > 0 || comp.minutes > 0 || comp.seconds > 0) ret += `${(<any>comp).seconds.toString().padStart(2, '0')}s`;

      return ret;
      //return `${comp.days} days ${comp.hours.toString().padStart(2, '0')}h${comp.minutes.toString().padStart(2, '0')}m${comp.seconds.toString().padStart(2, '0')}s`;
    }
    else {



      return `${(<any>comp).days.toString().padStart(2, '0')}:${(<any>comp).hours.toString().padStart(2, '0')}:${(<any>comp).minutes.toString().padStart(2, '0')}:${(<any>comp).seconds.toString().padStart(2, '0')}`;
    }
  }

  private getComponents(value: number): { days?: number, hours?: number, minutes?: number, seconds?: number } {
    let v = value / 86400.0;

    let days = parseInt(<any>v);

    v = (v - days) * 24.0;

    let hours = parseInt(<any>v);

    v = (v - hours) * 60.0;

    let mins = parseInt(<any>v);

    v = (v - mins) * 60.0;

    let seconds = parseInt(<any>Math.round(v));

    return { days: days, hours: hours, minutes: mins, seconds: seconds }
  }

}
