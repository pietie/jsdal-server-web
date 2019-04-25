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
        static getFullEndpointList(): Promise<[{ Project: boolean, App: string, Endpoint: string }]> {
            return <any>L2.fetchJson(`/api/exec-tester/endpoints`).then((r: any) => r.Data);
        }

        //TODO: move to appropriate class 
        static searchRoutine(project:string, app:string, endpoint:string, query:string): Promise<string[]> {
            return <any>L2.fetchJson(`/api/exec-tester/search-routine?project=${project}&app=${app}&endpoint=${endpoint}&query=${query}`);
        }

        //TODO: move to appropriate class 
        static getRoutineMetadata(project:string, app:string, endpoint:string, routine:string): Promise<string[]> {
            return <any>L2.fetchJson(`/api/exec-tester/routine-metadata?project=${project}&app=${app}&endpoint=${endpoint}&routine=${routine}`);
        }
    }
}
