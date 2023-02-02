import { L2 } from 'l2-lib/L2';
import { BaseApi } from './base-api';

export module app {

    export class bgtasks extends BaseApi {

        static getAll() : Promise<[{ Name: string }]> {
            return <any>this.get(`/api/bgtask`)
                .then((r: any) => {
                    return r.Data;
                });
        }
    }

}
