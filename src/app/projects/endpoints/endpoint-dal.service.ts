import { Injectable } from '@angular/core';
import { L2 } from 'l2-lib/L2';
import { ApiService } from '~/services/api';


@Injectable()
export class EndpointDALService { // TODO: move code into API services?

  constructor(public api:ApiService) { }


  public get(project: string, dbSource: string, endpoint: string): Promise<IEndpoint> {
    return this.api.get(`/api/endpoint/${endpoint}?project=${project}&dbSource=${dbSource}`).then((r: any) => r.Data);
  }

  public enableDisableMetadataCapturing(project: string, dbSource: string, endpoint: string, enable: boolean): Promise<any> {
    return this.api.post(`/api/endpoint/${endpoint}/metadata-capturing?project=${project}&dbSource=${dbSource}&enable=${enable}`)
      .then((r: any) => r.Data);
  }

  updateConnection(detail: {
    project: string, dbSource: string, endpoint: string,
    isMetadata: boolean,
    dataSource: string,
    catalog: string,
    authType: number, username?: string, password?: string, port: number, encrypt?: boolean
  }): Promise<any> {
    return this.api.post(`/api/endpoint/${detail.endpoint}/connection?projectName=${detail.project}&dbSourceName=${detail.dbSource}`, {
      body: JSON.stringify({
        isMetadata: detail.isMetadata,
        dataSource: detail.dataSource,
        catalog: detail.catalog,
        authType: detail.authType,
        username: L2.nullToEmpty(detail.username),
        password: L2.nullToEmpty(detail.password),
        port: detail.port,
        encrypt: detail.encrypt
      })
    });
  }

  testConnection(): Promise<any> {
    return null;

  }

  public getCacheRoutines(project: string, dbSource: string, endpoint: string, query: string, type: string, status: string, hasMetadata?: boolean, isDeleted?: boolean): Promise<{ TotalCount: number, Results: any[] }> {
    return this.api.get(`/api/endpoint/${endpoint}/cachedroutines?project=${project}&dbSource=${dbSource}&q=${query}&type=${type}&status=${status}&hasMeta=${!!hasMetadata}&isDeleted=${!!isDeleted}`)
      .then((r: any) => r.Data);
  }
}

export interface IEndpoint {
  Name?: string;
  IsOrmInstalled?: boolean;
  MetadataConnection?: any;
  ExecutionConnection?: any;
  BgTaskKey?: string;
  DisableMetadataCapturing?: boolean;
  PullsMetadataFromEndpoint: boolean;
  PullMetdataFromEndpointPedigree: string;
  PullMetdataFromEndpointError: string;

}
