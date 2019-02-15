import { L2 } from 'l2-lib/L2';

export module app {

    export class bgtasks {

        static getAll() : Promise<[{ Name: string }]> {
            return <any>L2.fetchJson(`/api/bgtask`)
                .then((r: any) => {
                    return r.Data;
                });
        }
    }

}