import { Injectable } from '@angular/core';
import { L2 } from 'l2-lib/L2';

@Injectable()
export class FirstTimeSetupCompletedService {
    private isCompletedPromise: Promise<boolean>;

    constructor() {

        let url:string = '/api/main/issetupcomplete';

        if (window.location.port == '4200') url = 'http://localhost:5000' + url;

        this.isCompletedPromise = fetch(url)
            .then(response => {
                if (response.ok) return response.json();
                else throw new Error("Network error");
            })
            .then((json: any) => {
                return json.Data;
            });
    }

    public get isFirstTimeSetupComplete(): Promise<boolean> {
        return this.isCompletedPromise;
    }
}