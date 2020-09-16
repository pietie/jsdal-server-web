import { L2 } from 'l2-lib/L2';
import { IApiResponse } from './../api-response';

//export module app {

export class performance {

  // deprecated
  static getTopResources(): Promise<any> {
    return <any>L2.fetchJson(`/api/performance/top`)
      .then((r: any) => {
        return r.Data;
      });

  }

  static getStatsTotalCounts(top:number): Promise<any> {
    return <any>L2.fetchJson(`/api/performance/stats/totalcounts?top=${top}`)
      .then((r: any) => {
        return r.Data;
      });

  }

  static getStatsTotalsEntryCount(): Promise<number> {
    return <any>L2.fetchJson(`/api/performance/stats/totalcounts/numofentries`)
      .then((r: any) => {
        return r;
      });

  }

}

//}
