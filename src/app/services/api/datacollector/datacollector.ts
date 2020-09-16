import { L2 } from 'l2-lib/L2';
import { IApiResponse } from './../api-response';

export class dataCollector {

  static clearoutExecutions() {
    return L2.deleteJson('/api/data-collector/executions').then(r => r);
  }

  static getAllDataTmp() {
    return L2.fetchJson(`/api/data-collector`).then(r => r);///.then((r: any) => r.Data);
  }

}
