import { L2 } from 'l2-lib/L2';
import { IApiResponse } from './../api-response';

export class exceptions {

    static getRecent(filter: { top?: number, app?: string[], endpoint?: string[], routine?: string }): Promise<{ TotalExceptionCnt: number, Results: ExceptionWrapper }> {

        let filterCopy = { ...filter };

        if (filterCopy.app && filterCopy.app.length == 1 && filterCopy.app[0].toLowerCase() == "all") delete filterCopy.app;
        if (filterCopy.endpoint && filterCopy.endpoint.length == 1 && filterCopy.endpoint[0].toLowerCase() == "all") delete filterCopy.endpoint;

        // filter out nulls
        let qs = Object.keys(filterCopy).map(k => filterCopy[k] ? k : null).filter(k => k).map(k => k + "=" + filterCopy[k]).join("&")

        return L2.fetchJson(`/api/exception/recent?${qs}`)
            .then((r: any) => r.Data);
    }

    static get(id: string, parentId: string = null): Promise<any> {
        if (parentId != null) return L2.fetchJson(`/api/exception/${id}?parent=${parentId}`).then((r: any) => r.Data);
        else return L2.fetchJson(`/api/exception/${id}`).then((r: any) => r.Data);
    }

    static getRelated(id: string): Promise<any> {
        return L2.fetchJson(`/api/exception/${id}/related`).then((r: any) => r.Data);
    }

    static getAppTitles(): Promise<string[]> {
        return L2.fetchJson(`/api/exception/app-titles`).then((r: any) => r.Data);
    }

    static getEndpoints(): Promise<string[]> {
        return L2.fetchJson(`/api/exception/endpoints`).then((r: any) => r.Data);
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
