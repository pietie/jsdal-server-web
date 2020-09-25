import { L2 } from 'l2-lib/L2';
import { IApiResponse } from './../api-response';

export class dataCollector {

  static clearoutExecutions() {
    return L2.deleteJson('/api/data-collector/executions').then(r => r);
  }

  static topN(options: {
    topN: number,
    fromDate: Date | moment.Moment,
    toDate: Date | moment.Moment,
    endpoints: string | string[],
    type: number
  }) {
    let from:moment.Moment = <any>options.fromDate;
    let to:moment.Moment = <any>options.toDate;
    let ep = options.endpoints;

    if (!moment.isMoment(from)) from = moment(from);
    if (!moment.isMoment(to)) to = moment(to);

    if (options.endpoints instanceof Array) ep = options.endpoints.join(",");

    if (ep == undefined || ep == null) ep = "";

    return L2.getJson(`/api/data-collector/topN?n=${options.topN}&from=${from.format("YYYYMMDDHHmm")}&to=${to.format("YYYYMMDDHHmm")}&endpoints=${ep}&type=${options.type}`)
      .then(r => r);
  }

  static allEndpoints$: Promise<any>;

  static getAllEndpoints(): Promise<string[]> {
    // return cached version if available
    if (dataCollector.allEndpoints$) return dataCollector.allEndpoints$;

    dataCollector.allEndpoints$ = L2.getJson(`/api/data-collector/endpoints`)
      .then((r: IApiResponse) => {

        if (r.Data && !r.Message) {
          return r.Data.map(x => x.Endpoint);
        }


      });

    return dataCollector.allEndpoints$;
  }

  ///api/data-collector/endpoints

  static getAllDataTmp() {
    return L2.getJson(`/api/data-collector`).then(r => r);
  }

  static getSampleData(): Promise<{ Bracket: number, AvgDurationInMS: number, Routine: string }[]> {
    return <any>L2.getJson(`/api/data-collector/test-data`);
  }

}
