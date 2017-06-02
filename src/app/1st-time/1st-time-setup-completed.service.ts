import { Injectable } from '@angular/core';
import L2 from 'l2-lib/L2';

@Injectable()
export class FirstTimeSetupCompletedService {
    private isCompletedPromise: Promise<boolean>;

    constructor() {
        this.isCompletedPromise = L2.fetchJson("/api/main/issetupcomplete").then((json: any) => {
            return json.Data;
        });
    }

    public get isFirstTimeSetupComplete(): Promise<boolean> {
        return this.isCompletedPromise;
    }
}