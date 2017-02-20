import {Injectable} from '@angular/core';

@Injectable()
export class ProjectService {
    public currentProject: IProject
    public currentDatabaseSource: IDBSource;
}

interface IProject {
    Name?: string;
}

interface IDBSource {
    DataSource?: string;
    DefaultRuleMode?: any;
    InitialCatalog?: string;
    IsOrmInstalled?: boolean;
    JsNamespace?: string;
    Name?: string;
}