import { L2 } from 'l2-lib/L2';
import { IApiResponse } from './../api-response';
import { BaseApi } from './base-api';

//export module app {

export class performance extends BaseApi {

  // deprecated
  static getTopResources(): Promise<any> {
    return <any>this.get(`/api/performance/top`)
      .then((r: any) => {
        return r.Data;
      });

  }

  static getStatsTotalCounts(top:number): Promise<any> {
    return <any>this.get(`/api/performance/stats/totalcounts?top=${top}`)
      .then((r: any) => {
        return r.Data;
      });

  }

  static getStatsTotalsEntryCount(): Promise<number> {
    return <any>this.get(`/api/performance/stats/totalcounts/numofentries`)
      .then((r: any) => {
        return r;
      });

  }

}

//}
