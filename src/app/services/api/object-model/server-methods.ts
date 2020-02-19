import { L2 } from 'l2-lib/L2';
import { IApiResponse } from './../api-response';

export module app {

    export class serverMethods {

        static getList(): Promise<[{ Id: string, InlineEntryId: string, Name:string, IsInline: boolean, IsValid: boolean, Plugins: [{ Name: string, Description: string }] }]> {
            return <any>L2.fetchJson(`/server-method`)
                .then((r: any) => {
                    return r.Data;
                });

        }

        // static addUpdate(id?: string, code?: string): Promise<{ CompilationError?: string, id?: string }> {
        //     return <any>L2.postJson(`/server-method/${L2.nullToEmpty(id)}`, { body: code })
        //         .then((r: any) => {
        //             return r.Data;
        //         });
        // }

        // static getSource(id: string): Promise<string> {
        //     return <any>L2.fetchJson(`/server-method/${L2.nullToEmpty(id)}`).then((r: any) => r.Data);

        // }

        // static delete(id: string): Promise<IApiResponse> {
        //     return <any>L2.deleteJson(`/server-method/${L2.nullToEmpty(id)}`);

        // }

    }

}