import { Injectable, ApplicationRef } from '@angular/core';
import { L2 } from 'l2-lib/L2';

@Injectable()
export class FirstTimeSetupCompletedService {
    private isCompletedPromise: Promise<boolean>;

    constructor(private appRef: ApplicationRef) {
        this.retry();
    }

    public get isFirstTimeSetupComplete(): Promise<boolean> {
        return this.isCompletedPromise;
    }

    public retry() {
        let url: string = '/api/main/issetupcomplete';

        if (window.location.port == '4200') url = 'https://api.jsdal.com' + url;

        // sigh...need this to continually force change detection - in a fetch network failure the last change is not detected for some reason!
        let timerId = setInterval(() => { console.log("tick"); this.appRef.tick(); }, 500);


        this.isCompletedPromise = fetch(url)
            .then(response => {
                clearTimeout(timerId);
                console.log("002");
                if (response.ok) return response.json();
                else throw new Error("Network error");
            })
            .then((json: any) => {
                clearTimeout(timerId);
                console.log("003");
                return json.Data;
            }).catch(e => {
                clearTimeout(timerId);
                throw e;
            });

    }
}