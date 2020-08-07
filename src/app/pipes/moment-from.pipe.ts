import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'momentFromNow'
})
export class MomentFromNowPipe implements PipeTransform {

  transform(value: Date, ...args: any[]): string {
    if (value == null) return null;

    let momFrom = moment();
    let momTo = null;

    if (moment.isMoment(value)) momTo = value;
    else momTo = moment(value);

    if (args.length > 0 && args[0] == "utc") {
      momFrom = moment.utc();

      if (!(<any>momTo).isUTC()) {
        momTo = moment.utc(value);
      }
    }

    let numOfDays = momFrom.diff(momTo, "day");

    if (numOfDays < 7) {
      return momTo.fromNow();
    }
    else if (numOfDays < 365) {
      return "on " + momTo.format("DD MMM");
    }
    else {
      return "on " + momTo.format("DD MMM YYYY");
    }
  }

}
