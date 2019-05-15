import { L2 } from 'l2-lib/L2';
import { IApiResponse } from './../api-response';

//export module app {

    export class performance {

        static getTopResources(): Promise<any> {
            return <any>L2.fetchJson(`/api/performance/top`)
                .then((r: any) => {
                    return r.Data;
                });

        }

        

    }

//}