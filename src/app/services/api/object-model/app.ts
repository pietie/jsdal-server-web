import { L2 } from 'l2-lib/L2';
import { IApiResponse } from './../api-response';

export module app {

    export class whitelist {
        static getAll(projectName: string, appName: string): Promise<{ AllowAllPrivate: boolean, Whitelist: string[] }> {

            return <any>L2.fetchJson(`/api/app/${appName}/whitelist?project=${projectName}`).then((r: any) => {
                return r.Data;
            });

        }

        static save(projectName: string, appName: string, whitelist: string, allowAllPrivateIPs: boolean): Promise<IApiResponse> {
            return <any>L2.postJson(`/api/app/${appName}/whitelist?project=${projectName}&whitelist=${encodeURIComponent(whitelist)}&allowAllPrivate=${allowAllPrivateIPs}`);
        }


    }

    export class plugins {

        static addUpdateInline(id: string, name: string, description: string, code: string): Promise<{ CompilationError?: string, id?: string }> {
            return <any>L2.postJson(`/inline-plugin/${L2.nullToEmpty(id)}`, { body: JSON.stringify({ name: name, description: description, code: code }) })
                .then((r: any) => {
                    return r.Data;
                });
        }

        static getAll(projectName: string, appName: string): Promise<{ Name: string, Description: string, Guid: string, Included: boolean, SortOrder: number }[]> {
            return <any>L2.fetchJson(`/api/app/${appName}/plugins?project=${projectName}`).then((r: any) => {
                return r.Data;
            });
        }

        static saveConfig(projectName: string, appName: string, pluginList: any[]): Promise<IApiResponse> {
            return <any>L2.postJson(`/api/app/${appName}/plugins?project=${projectName}`, { body: JSON.stringify(pluginList) });
            // .then(r => {
            //     L2.success("Plugin changes saved successfully");
            // });
        }

        static getAllBackgroundThreads() {
            return <any>L2.fetchJson(`/api/bgthreads`).then((r: any) => {
                return r.Data;
            });
        }

        static startBgThreadInstance(instanceId: string) // TODO: move to BGThread API?
        {
            return <any>L2.postJson(`/api/bgthreads/${instanceId}/start`);
        }

        static stopBgThreadInstance(instanceId: string) // TODO: move to BGThread API?
        {
            return <any>L2.postJson(`/api/bgthreads/${instanceId}/stop`);
        }

        static getBgThreadAllConfigs(pluginGuid: string): Promise<{ ConfigContract?: any/*TODO: will describe the expected fields & values and their types and maybe the editor experience required!*/, Default: { [key: string]: string }, Plugin: { [key: string]: string }, App: { [key: string]: string }, Endpoint: { [key: string]: string }, Instances: any }> {
            return <any>L2.getJson(`/api/bgthreads/${pluginGuid}/all-config`).then((r: any) => r.Data);
        }
    }

    export class jsfiles {

        static add(projectName: string, appName: string, jsFilename: string): Promise<IApiResponse> {
            return <any>L2.postJson(`/api/app/${appName}/file?project=${projectName}&jsFileName=${jsFilename}`);
        }

        static update(projectName: string, appName: string, oldName: string, newName: string): Promise<IApiResponse> {
            return <any>L2.putJson(`/api/app/${appName}/file?project=${projectName}&oldName=${oldName}&newName=${newName}`);
        }

        static delete(projectName: string, appName: string, fileName: string): Promise<IApiResponse> {
            return <any>L2.deleteJson(`/api/app/${appName}/file/${fileName}?project=${projectName}`);
        }

        static getAll(projectName: string, appName: string): Promise<{ Filename: string, Id: string }[]> {
            return <any>L2.fetchJson(`/api/app/${appName}/file?project=${projectName}`).then((r: any) => {
                return r.Data;
            });
        }

    }

    export class endpoint {
        static installOrm(projectName: string, appName: string, endpointName: string): Promise<{ Success: boolean, BgTaskKey: string }> {
            return <any>L2.postJson(`/api/endpoint/${endpointName}/installOrm?projectName=${projectName}&dbSourceName=${appName}`).then((r: any) => r.Data);
        }

        //TODO: move to appropriate class 
        static getFullEndpointList(): Promise<[{ Project: string, App: string, Endpoint: string }]> {
            return <any>L2.fetchJson(`/api/exec-tester/endpoints`).then((r: any) => r.Data);
        }

        //TODO: move to appropriate class 
        static searchRoutine(project: string, app: string, endpoint: string, query: string): Promise<string[]> {
            return <any>L2.fetchJson(`/api/exec-tester/search-routine?project=${project}&app=${app}&endpoint=${endpoint}&query=${query}`);
        }

        //TODO: move to appropriate class 
        static getRoutineMetadata(project: string, app: string, endpoint: string, routine: string): Promise<string[]> {
            return <any>L2.fetchJson(`/api/exec-tester/routine-metadata?project=${project}&app=${app}&endpoint=${endpoint}&routine=${routine}`);
        }
    }
}

