import { L2 } from 'l2-lib/L2';
import { IApiResponse } from './../api-response';


    export class util {

        static newGuid(): Promise<string> {
            return L2.getText(`/api/util/new-guid`)
                .then((r: any) => {
                    return r.text();
                });
        }
    }

