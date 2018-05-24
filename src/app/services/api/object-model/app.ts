import { L2 } from 'l2-lib/L2';
import { IApiResponse } from './../api-response';

export module app {

    export class whitelist {
        static getAll(projectName: string, appName: string): Promise<{ AllowAllPrivate: boolean, Whitelist: string[] }> {

            return <any>L2.fetchJson(`/api/app/${appName}/whitelist?project=${projectName}`).then((r: any) => {
                return r.Data;
            });

        }

        static save(projectName: string, appName: string, whitelist: string, allowAllPrivateIPs: boolean) : Promise<IApiResponse> {
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
}

