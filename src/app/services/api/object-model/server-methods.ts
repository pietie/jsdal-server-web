import { L2 } from 'l2-lib/L2';
import { IApiResponse } from './../api-response';
import { BaseApi } from './base-api';

export module app {

  export class serverMethods extends BaseApi {

    static getList(): Promise<[{ Id: string, InlineEntryId: string, Name: string, IsInline: boolean, IsValid: boolean, Plugins: [{ Name: string, Description: string }] }]> {
      return <any>this.get(`/server-method`)
        .then((r: any) => {
          return r.Data;
        });

    }

  }

}
