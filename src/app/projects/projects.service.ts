import { Injectable } from '@angular/core';
import { Observable ,  BehaviorSubject } from 'rxjs';

import { L2 } from 'l2-lib/L2';

@Injectable()
export class ProjectService {

    private dbList: IDBSource[];

    private dbListSubject$: BehaviorSubject<IDBSource[]>;

    constructor() {

        this.dbListSubject$ = new BehaviorSubject<IDBSource[]>(null);
    }

    public getAllApps(projectName: string): Promise<IDBSource[]> {

        return L2.fetchJson(`/api/app?project=${projectName}`).then((resp: any) => {
            this.dbList = resp.Data;


            this.dbListSubject$.complete();

            return resp.Data;
        }).catch(e => {
            console.error(e);
            this.dbListSubject$.error(e);

        });
    }

    public getApp(project: string, dbSource: string): Promise<IDBSource> {
        return L2.fetchJson(`/api/app/${dbSource}?project=${project}`).then((r: any) => r.Data);
    }

    

}

export interface IDBSource {
    DataSource?: string;
    DefaultRuleMode?: any;
    InitialCatalog?: string;
    IsOrmInstalled?: boolean;
    JsNamespace?: string;
    Name?: string;
}

