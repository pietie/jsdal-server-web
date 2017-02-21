import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
//import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import * as L2 from '../L2'

@Injectable()
export class ProjectService {
    //public currentProject: IProject
    //public currentDatabaseSource: IDBSource;
    private dbList: IDBSource[];

    private dbListSubject$: BehaviorSubject<IDBSource[]>;

    constructor() {

        this.dbListSubject$ = new BehaviorSubject<IDBSource[]>(null);
        console.log("PROJECT SERVICE CONSTRUCTED");
    }

    public getDbSourceList(projectName: string): Promise<IDBSource[]> {
        console.log("calling fetch");

        return L2.fetchJson(`/api/database?project=${projectName}`).then((resp: any) => {
            this.dbList = resp.Data;

            //this.dbListSubject$.next(resp.Data);
            console.log("calling complete!");
            this.dbListSubject$.complete();


            return resp.Data;
        }).catch(e => {
            console.error(e);
            this.dbListSubject$.error(e);

        });
    }

    public getDbSource(project: string, dbSource: string): Promise<IDBSource> {
        return L2.fetchJson(`/api/dbs/${project}/${dbSource}`).then((r:any)=>r.Data);
        
        /*    
            return new Promise<IDBSource>((resolve, reject) => {
    
                this.dbListSubject$.subscribe((next)=>
                {
                    if (!next) resolve(null);
                    console.log("received next:", next);
                }, err=>
                {
                    console.log("dbListSubject$::error", err);
                    }, () => {
                    let data = this.dbList;
    
                    console.log("DATA!!!!", data);
                    if (!data) {
                        resolve(null);
                        return null;
                    }
    
                    let r = data.find(db => db.Name.toLowerCase() == name.toLowerCase());
                    resolve(r);
    
                    //this.dbListSubject$.unsubscribe();
                    //this.dbListSubject$ = new BehaviorSubject<IDBSource[]>(null);
                });//.unsubscribe();
    
                console.log("5555", this.dbListSubject$);
    
                /***
                if (!this.dbList) {
                    resolve(null);
                    return null;
                }
    
                return this.dbList.find(db => db.Name.toLowerCase() == name.toLowerCase());* * /
            });
            */

    }



}

// interface IProject {
//     Name?: string;
// }

export interface IDBSource {
    DataSource?: string;
    DefaultRuleMode?: any;
    InitialCatalog?: string;
    IsOrmInstalled?: boolean;
    JsNamespace?: string;
    Name?: string;
}