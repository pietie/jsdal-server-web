import { L2 } from 'l2-lib/L2';
import { IApiResponse } from './../api-response';

export class health {


  static getReport(options: {
    from: Date | moment.Moment,
    to: Date | moment.Moment
  }) {
    let from: moment.Moment = <any>options.from;
    let to: moment.Moment = <any>options.to;

    if (from && from.constructor.name != "Moment") from = moment(from);
    if (to && to.constructor.name != "Moment") to = moment(to);
    return L2.getJson(`/api/health/topN?from=${from.format("YYYYMMDDHHmm")}&to=${to.format("YYYYMMDDHHmm")}`);
  }

  static restartThread(): Promise<any> {
    return L2.postJson(`/api/health/start`).then((r: any) => r);
  }

  static stopThread(): Promise<any> {
    return L2.postJson(`/api/health/stop`).then((r: any) => r);
  }

  static getThreadStatus(): Promise<any> {
    return L2.getJson(`/api/health/thread-status`);
  }

  static getLatest(): Promise<any> {
    return L2.getJson(`/api/health/latest`);
  }

}
