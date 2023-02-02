import { L2 } from 'l2-lib/L2';
import { BaseApi } from '../object-model/base-api';
import { IApiResponse } from './../api-response';

export class dataCollector extends BaseApi {

  static clearoutExecutions() {
    return this.del('/api/data-collector/executions').then(r => r);
  }

  static topN(options: {
    topN: number,
    from: Date | moment.Moment,
    to: Date | moment.Moment,
    endpoints: string | string[],
    type: number
  }) {
    let from: moment.Moment = <any>options.from;
    let to: moment.Moment = <any>options.to;
    let ep = options.endpoints;

    if (from && from.constructor.name != "Moment") from = moment(from);
    if (to && to.constructor.name != "Moment") to = moment(to);

    let endpointsQS = "";

    if (options.endpoints == null || options.endpoints == undefined) options.endpoints = [];
    if (!(options.endpoints instanceof Array)) options.endpoints = [options.endpoints];

    endpointsQS = options.endpoints.map(ep => `endpoints=${ep}`).join("&");

    return this.get(`/api/data-collector/topN?n=${options.topN}&from=${from.format("YYYYMMDDHHmm")}&to=${to.format("YYYYMMDDHHmm")}&${endpointsQS}&type=${options.type}`);

  }

  static topNAllStatsList(options: {
    topN: number,
    from: Date | moment.Moment,
    to: Date | moment.Moment,
    endpoints: string | string[]
  }) {
    let from: moment.Moment = <any>options.from;
    let to: moment.Moment = <any>options.to;
    let ep = options.endpoints;

    if (from && from.constructor.name != "Moment") from = moment(from);
    if (to && to.constructor.name != "Moment") to = moment(to);

    let endpointsQS = "";

    if (options.endpoints == null || options.endpoints == undefined) options.endpoints = [];
    if (!(options.endpoints instanceof Array)) options.endpoints = [options.endpoints];

    endpointsQS = options.endpoints.map(ep => `endpoints=${ep}`).join("&");

    return this.get(`/api/data-collector/topN-list?n=${options.topN}&from=${from.format("YYYYMMDDHHmm")}&to=${to.format("YYYYMMDDHHmm")}&${endpointsQS}`);
  }

  static routineTotals(options: {
    schema: string,
    routine: string,
    from: Date | moment.Moment,
    to: Date | moment.Moment,
    endpoints: string | string[]
  }) {
    let from: moment.Moment = <any>options.from;
    let to: moment.Moment = <any>options.to;
    let ep = options.endpoints;

    if (from && from.constructor.name != "Moment") from = moment(from);
    if (to && to.constructor.name != "Moment") to = moment(to);

    let endpointsQS = "";

    if (options.endpoints == null || options.endpoints == undefined) options.endpoints = [];
    if (!(options.endpoints instanceof Array)) options.endpoints = [options.endpoints];

    endpointsQS = options.endpoints.map(ep => `endpoints=${ep}`).join("&");

    return this.get(`/api/data-collector/routine-totals?schema=${options.schema}&routine=${options.routine}&from=${from.format("YYYYMMDDHHmm")}&to=${to.format("YYYYMMDDHHmm")}&${endpointsQS}`);
  }

  static allEndpoints$: Promise<any>;

  static getAllEndpoints(): Promise<string[]> {
    // return cached version if available
    if (dataCollector.allEndpoints$) return dataCollector.allEndpoints$;

    dataCollector.allEndpoints$ = this.get(`/api/data-collector/endpoints`)
      .then((r: IApiResponse) => {

        if (r.Data && !r.Message) {
          return r.Data.map(x => x.Endpoint);
        }
      });

    return dataCollector.allEndpoints$;
  }


  static getAllDataTmp() {
    return this.get(`/api/data-collector`);
  }

  static fetchStats() {
    return this.get(`/api/data-collector/stats/agg`);
  }

  static purge(options: { daysOld: number }): Promise<number> {
    return this.post(`/api/data-collector/purge?daysOld=${options.daysOld}`).then((r: any) => r);
  }

  static restartThread(): Promise<any> {
    return this.post(`/api/data-collector/start`).then((r: any) => r);
  }

  static stopThread(): Promise<any> {
    return this.post(`/api/data-collector/stop`).then((r: any) => r);
  }

  static getThreadStatus(): Promise<any> {
    return this.get(`/api/data-collector/thread-status`);
  }


}
