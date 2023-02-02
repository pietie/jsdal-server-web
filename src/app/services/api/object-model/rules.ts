import { L2 } from 'l2-lib/L2';
import { IApiResponse } from './../api-response';
import { BaseApi } from './base-api';

export module app {

  export class rules extends BaseApi {

    static getRoutineList(projectName: string, appName: string, file: string): Promise<{ Routines: any[], DefaultRuleMode: number }> {

      return <any>this.get(`/api/rule/routine-list?project=${projectName}&app=${appName}&file=${L2.nullToEmpty(file)}`)
        .then((r: any) => {
          return r.Data;
        });

    }

    static getRuleList(projectName: string, appName: string, file: string): Promise<{
      Type: number,
      Description: string,
      Id: string,
      IsAppRule: boolean,
      AppLevelOnly: boolean,
      AffectedCount: number
    }> {

      return <any>this.get(`/api/rule?project=${projectName}&app=${appName}&file=${L2.nullToEmpty(file)}`)
        .then((r: any) => {
          return r.Data;
        });
    }

    static addRule(projectName: string, appName: string, file: string, data: Object) {
      return <any>this.post(`/api/rule?project=${projectName}&app=${appName}&file=${L2.nullToEmpty(file)}`, { body: JSON.stringify(data) });
    }

    static updateRule(projectName: string, appName: string, file: string, ruleId: string, data: Object) {
      return <any>this.put(`/api/rule/${ruleId}?project=${projectName}&app=${appName}&file=${L2.nullToEmpty(file)}`, { body: JSON.stringify(data) });
    }

    static deleteRule(projectName: string, appName: string, file: string, ruleId: string) {
      return <any>this.del(`/api/rule/${ruleId}?project=${projectName}&app=${appName}&file=${L2.nullToEmpty(file)}`);
    }

  }

}
