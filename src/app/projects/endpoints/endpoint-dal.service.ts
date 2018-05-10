import { Injectable } from '@angular/core';
import { L2 } from 'l2-lib/L2';

@Injectable()
export class EndpointDALService {

    constructor() { }


    public get(project: string, dbSource: string, endpoint: string): Promise<IEndpoint> {
        return L2.fetchJson(`/api/endpoint/${endpoint}?project=${project}&dbSource=${dbSource}`).then((r: any) => r.Data);
    }

    updateConnection(detail: {
        project: string, dbSource: string, endpoint: string,
        isMetadata: boolean,
        dataSource: string,
        catalog: string,
        authType: number, username?: string, password?: string, port: number
    }): Promise<any> {
        return L2.postJson(`/api/endpoint/${detail.endpoint}/connection?projectName=${detail.project}&dbSourceName=${detail.dbSource}`, {
            body: JSON.stringify({
                isMetadata: detail.isMetadata,
                dataSource: detail.dataSource,
                catalog: detail.catalog,
                authType: detail.authType,
                username: L2.nullToEmpty(detail.username),
                password: L2.nullToEmpty(detail.password),
                port: detail.port
            })
        });
    }

    testConnection(): Promise<any> {
        return null;
        // return L2.fetchJson(`/api/util/testconnection?dataSource=${this.obj.dataSource}&catalog=${this.obj.database}&username=${L2.nullToEmpty(user)}&password=${L2.nullToEmpty(pass)}&port=${this.obj.port}`).then(() => {
        //     this.isTestingConnection = false;
        //     L2.success("Connection successful");
        // }).catch((e) => { this.isTestingConnection = false; L2.handleException(e); });
    }
}



export interface IEndpoint {
    Name?: string;
    IsOrmInstalled?: boolean;
    MetadataConnection?: any;
    ExecutionConnection?: any;
}