import { L2 } from 'l2-lib/L2';
import { BaseApi } from '../object-model/base-api';
import { IApiResponse } from './../api-response';

export class exceptions extends BaseApi {

  static getRecent(filter: { top?: number, app?: string[], endpoint?: string[], routine?: string }): Promise<{ TotalExceptionCnt: number, Results: ExceptionWrapper[] }> {

    let filterCopy = { ...filter };

    if (filterCopy.app && filterCopy.app.length == 1 && filterCopy.app[0].toLowerCase() == "all") delete filterCopy.app;
    if (filterCopy.endpoint && filterCopy.endpoint.length == 1 && filterCopy.endpoint[0].toLowerCase() == "all") delete filterCopy.endpoint;

    // filter out nulls
    let qs = Object.keys(filterCopy).map(k => filterCopy[k] ? k : null).filter(k => k).map(k => k + "=" + filterCopy[k]).join("&")

    return this.get(`/api/exception/recent?${qs}`)
      .then((r: any) => r.Data);
  }

  static getException(id: string, parentId: string = null): Promise<any> {
    if (parentId != null) return this.get(`/api/exception/${id}?parent=${parentId}`).then((r: any) => r.Data);
    else return this.get(`/api/exception/${id}`).then((r: any) => r.Data);
  }

  static getRelated(id: string): Promise<any> {
    return this.get(`/api/exception/${id}/related`).then((r: any) => r.Data);
  }

  static getAppTitles(): Promise<string[]> {
    return this.get(`/api/exception/app-titles`).then((r: any) => r.Data);
  }

  static getEndpoints(): Promise<string[]> {
    return this.get(`/api/exception/endpoints`).then((r: any) => r.Data);
  }

}

export class ExceptionWrapper {
  created: Date;
  id: string;
  appTitle: string;
  message: string;
  stackTrace: string;
  innerException: ExceptionWrapper;
  execOptions: ExecOptions;
}

export class ExecOptions {
  project: string;
  application: string;
  endpoint: string;
  schema: string;
  routine: string;
  type: ExecType;
  inputParameters: { [key: string]: string };
}

export enum ExecType {
  Query = 0,
  NonQuery = 1,
  Scalar = 2,
  ServerMethod = 10
}
