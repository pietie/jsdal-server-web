import { L2 } from 'l2-lib/L2';
import { BaseApi } from '../object-model/base-api';
import { IApiResponse } from './../api-response';


export class util extends BaseApi {

  static getUptimeHistory() {
    return this.get(`/api/util/uptime`)
      .then((r: any) => {
        return r.Data;
      });
  }

  static newGuid(): Promise<string> {
    return this.get(`/api/util/new-guid`)
      .then((r: any) => {
        return r.text();
      });
  }
}

