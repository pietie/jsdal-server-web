import { L2 } from 'l2-lib/L2';
import { IApiResponse } from './../api-response';
import { BaseApi } from './base-api'

export module app {

  export class jsfiles extends BaseApi {

    static add(projectName: string, appName: string, jsFilename: string): Promise<IApiResponse> {
      return <any>this.post(`/api/app/${appName}/file?project=${projectName}&jsFileName=${jsFilename}`);
    }

    static update(projectName: string, appName: string, oldName: string, newName: string): Promise<IApiResponse> {
      return <any>this.put(`/api/app/${appName}/file?project=${projectName}&oldName=${oldName}&newName=${newName}`);
    }

    static delete(projectName: string, appName: string, fileName: string): Promise<IApiResponse> {
      return <any>this.del(`/api/app/${appName}/file/${fileName}?project=${projectName}`);
    }

    static getAll(projectName: string, appName: string): Promise<{ Filename: string, Id: string }[]> {
      return <any>this.get(`/api/app/${appName}/file?project=${projectName}`).then((r: any) => {
        return r.Data;
      });
    }
  }

}
