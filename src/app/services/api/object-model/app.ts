import { L2 } from 'l2-lib/L2';
import { IApiResponse } from './../api-response';
import { BaseApi } from './base-api';

export module app {

  export class whitelist extends BaseApi {
    static getAll(projectName: string, appName: string): Promise<{ AllowAllPrivate: boolean, Whitelist: string[] }> {

      return this.get(`/api/app/${appName}/whitelist?project=${projectName}`)
        .then((r: any) => {
          return r.Data;
        });

    }

    static save(projectName: string, appName: string, whitelist: string, allowAllPrivateIPs: boolean): Promise<IApiResponse> {
      return <any>this.post(`/api/app/${appName}/whitelist?project=${projectName}&whitelist=${encodeURIComponent(whitelist)}&allowAllPrivate=${allowAllPrivateIPs}`);
    }


  }

  export class plugins extends BaseApi {

    static getInlineAssemblies(): Promise<any> {
      return <any>this.get(`/inline-assemblies`).then((r: any) => r.Data);
    }

    static getDiagnostics(): Promise<any> {
      return <any>this.get(`/plugins/diagnostics`);
    }

    static addUpdateInline(id: string, name: string, description: string, code: string): Promise<{ CompilationError?: string, id?: string }> {
      return <any>this.post(`/inline-plugin/${L2.nullToEmpty(id)}`, { body: JSON.stringify({ name: name, description: description, code: code }) })
        .then((r: any) => {
          return r.Data;
        });
    }

    static getInlineSource(id: string): Promise<{ Name: string, Description: string, Source: string }> {
      return <any>this.get(`/inline-plugin/${L2.nullToEmpty(id)}`).then((r: any) => r.Data);
    }

    static getAll(projectName: string, appName: string): Promise<{ Name: string, Description: string, Guid: string, Included: boolean, IsInline: boolean, Type: PluginType, SortOrder: number }[]> {
      return <any>this.get(`/api/app/${appName}/plugins?project=${projectName}`).then((r: any) => {
        return r.Data;
      });
    }

    static saveConfig(projectName: string, appName: string, pluginList: any[]): Promise<IApiResponse> {
      return <any>this.post(`/api/app/${appName}/plugins?project=${projectName}`, { body: JSON.stringify(pluginList) });
      // .then(r => {
      //     L2.success("Plugin changes saved successfully");
      // });
    }

    static getAllBackgroundThreads() {
      return <any>this.get(`/api/bgthreads`).then((r: any) => {
        return r.Data;
      });
    }

    static startBgThreadInstance(instanceId: string) // TODO: move to BGThread API?
    {
      return <any>this.post(`/api/bgthreads/${instanceId}/start`);
    }

    static stopBgThreadInstance(instanceId: string) // TODO: move to BGThread API?
    {
      return <any>this.post(`/api/bgthreads/${instanceId}/stop`);
    }

    static getBgThreadAllConfigs(pluginGuid: string): Promise<{ ConfigContract?: any/*TODO: will describe the expected fields & values and their types and maybe the editor experience required!*/, Default: { [key: string]: string }, Plugin: { [key: string]: string }, App: { [key: string]: string }, Endpoint: { [key: string]: string }, Instances: any }> {
      return <any>this.get(`/api/bgthreads/${pluginGuid}/all-config`).then((r: any) => r.Data);
    }




  }

  export enum PluginType {
    Unknown = 0,
    Execution = 10,
    BackgroundThread = 20,
    ServerMethod = 30
  }



  export class endpoint extends BaseApi {
    static installOrm(projectName: string, appName: string, endpointName: string): Promise<{ Success: boolean, BgTaskKey: string }> {
      return <any>this.post(`/api/endpoint/${endpointName}/installOrm?projectName=${projectName}&dbSourceName=${appName}`).then((r: any) => r.Data);
    }

    //TODO: move to appropriate class
    static getFullEndpointList(): Promise<[{ Project: string, App: string, Endpoint: string }]> {
      return <any>this.get(`/api/exec-tester/endpoints`).then((r: any) => r.Data);
    }

    //TODO: move to appropriate class
    static searchRoutine(project: string, app: string, endpoint: string, query: string): Promise<string[]> {
      return <any>this.get(`/api/exec-tester/search-routine?project=${project}&app=${app}&endpoint=${endpoint}&query=${query}`);
    }

    //TODO: move to appropriate class
    static getRoutineMetadata(project: string, app: string, endpoint: string, routine: string): Promise<string[]> {
      return <any>this.get(`/api/exec-tester/routine-metadata?project=${project}&app=${app}&endpoint=${endpoint}&routine=${routine}`);
    }

    static getEndpointsWithMetadata(): Promise<any> {
      return <any>this.get(`/api/endpoints-with-metadata`)
        .then((r: any) => {
          return r.Data;
        });

    }

    static setupSharedMetadata(options: { project: string, app: string, endpoint: string, srcEndpointId: string }): Promise<any> {
      return <any>this.post(`/api/endpoint/${options.endpoint}/setup-shared-metadata?project=${options.project}&app=${options.app}&srcEndpointId=${options.srcEndpointId}`).then((r: any) => r.Data);
    }

    static clearSharedMetadata(options: { project: string, app: string, endpoint: string }): Promise<any> {
      return <any>this.post(`/api/endpoint/${options.endpoint}/setup-shared-metadata/clear?project=${options.project}&app=${options.app}`).then((r: any) => r.Data);
    }

    static getMetadataDependencies(options: { project: string, app: string, endpoint: string }): Promise<any> {
      return <any>this.get(`/api/endpoint/${options.endpoint}/metadata-dependencies?project=${options.project}&app=${options.app}`).then((r: any) => r.Data);
    }
  }

  export class policies extends BaseApi {

    static getExecutionPolicies(options: { projectName: string, appName: string }): Promise<{ Success: boolean }> {
      return <any>this.get(`/api/app/${options.appName}/exec-policy?project=${options.projectName}`).then((r: any) => r.Data);
    }

    static addUpdateExecutionPolicy(options: { projectName: string, appName: string, execPolicy: any }): Promise<{ Success: boolean }> {
      return <any>this.post(`/api/app/${options.appName}/exec-policy?project=${options.projectName}`, { body: JSON.stringify(options.execPolicy) }).then((r: any) => r.Data);
    }

    static setDefaultExecPolicy(options: { projectName: string, appName: string, execPolicyId: string }): Promise<{ Success: boolean }> {
      return <any>this.post(`/api/app/${options.appName}/exec-policy/set-default?project=${options.projectName}&id=${options.execPolicyId}`).then((r: any) => r.Data);
    }

    static deleteExecPolicy(options: { projectName: string, appName: string, execPolicyId: string }): Promise<{ Success: boolean }> {
      return <any>this.del(`/api/app/${options.appName}/exec-policy?project=${options.projectName}&id=${options.execPolicyId}`).then((r: any) => r.Data);
    }
  }
}

