import { L2 } from 'l2-lib/L2';
import { IApiResponse } from './../api-response';


export class util {

  static getUptimeHistory() {
    return L2.getJson(`/api/util/uptime`)
      .then((r: any) => {
        return r.Data;
      });
  }

  static newGuid(): Promise<string> {
    return L2.getText(`/api/util/new-guid`)
      .then((r: any) => {
        return r.text();
      });
  }
}

