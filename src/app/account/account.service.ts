import { Injectable } from '@angular/core';
import * as L2 from '../L2'
import { Observable } from 'rxjs/Observable';

import 'rxjs/Rx';
import { Subject } from 'rxjs/Subject'

import { environment } from '../../environments/environment';

@Injectable()
export class AccountService {

    private loggedIn: boolean = false;
    private jwt: JWT = null;

    private loggedInSubject: Subject<boolean>;
    
    public redirectUrl: string;

    constructor() {
        this.loggedInSubject = new Subject<boolean>();
    }

    public get isLoggedIn(): boolean {
        return this.loggedIn;
    }

    public get authToken(): string {
        return this.jwt.access_token;
    }


    public get whenLoggedIn(): Subject<boolean> {
        return this.loggedInSubject;
    }

    public loginFromStore(): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {

            var jwt = L2.BrowserStore.session<JWT>("jwt");
            var now = new Date();

            // check for existing, valid JWT 
            if (!jwt || !jwt.access_token || jwt.expiresBy < now) {
                resolve(false);
                return;
            }

            this.jwt = jwt;
            this.loggedIn = true;
            this.loggedInSubject.next(true);
            //?this.loggedInSubject.complete();

            resolve(true);
        });

    }


    getTokenUrl(): string {
        var client_id = "js.manual";

        var authorizationUrl = 'http://localhost:44333/connect/authorize';
        var redirect_uri = window.location.protocol + "//" + window.location.host + "/#/logged-in?";


        var response_type = "id_token token";
        var scope = "api openid";

        var state = (Date.now() + "" + Math.random()).replace(".", "");
        var nonce = (Date.now() + "" + Math.random()).replace(".", "");
        localStorage["state"] = state;
        localStorage["nonce"] = nonce;

        var url =
            authorizationUrl + "?" +
            "client_id=" + encodeURI(client_id) + "&" +
            "redirect_uri=" + encodeURIComponent(redirect_uri) + "&" +
            "response_type=" + encodeURI(response_type) + "&" +
            "scope=" + encodeURI(scope) + "&" +
            "state=" + encodeURI(state) + "&" +
            "nonce=" + encodeURI(nonce);

        return url;
    }

    public updateFromWinAuth(auth: any) {

        if (auth.access_token) {
            console.log("0001");
            this.jwt = auth;
            var expiresBy = new Date();
            console.log("0002");
            expiresBy.setSeconds(expiresBy.getSeconds() + this.jwt.expires_in);

            //        this.jwt.expiresBy = expiresBy;

            L2.BrowserStore.session<JWT>("jwt", this.jwt);
            console.log("0003");
            this.loggedIn = true;
            this.loggedInSubject.next(true);
        }
    }

    public login(options: { useWindowsAuth?: boolean, user?: string, pass?: string }): Promise<boolean> {

        if (options.useWindowsAuth) {
            // redirect to identity server auth page
            window.location.assign(this.getTokenUrl());
        }

        var url = 'api/auth';
        // PL: Temp hack when we are running with ng serve
        if (window.location.port == '4200') url = 'http://localhost:9086/' + url;

        var headers = new Headers();

        headers.append("Content-Type", "application/x-www-form-urlencoded")

        return fetch(url, {
            method: "POST"
            , headers: headers
            , body: `username=${options.user}&password=${options.pass}`
            , mode: 'cors'
        })
            .then((r: any) => {

                if ((r.status >= 200 && r.status < 300)) {
                    return <any>{ success: true, payloadPromise: r.json() };
                }
                else if (r.status == 400/*Bad request*/) { // auth failed
                    return { success: false };
                }
                else {
                    // return error?
                    //return null;
                    return { success: false };
                };
            })
            .then((r: { success: boolean, payloadPromise?: any }) => {
                this.loggedIn = r.success;
                this.loggedInSubject.next(r.success);

                if (r.success) {

                    return r.payloadPromise.then(json => {
                        this.jwt = json;
                        var expiresBy = new Date();

                        expiresBy.setSeconds(expiresBy.getSeconds() + this.jwt.expires_in);

                        this.jwt.expiresBy = expiresBy;

                        L2.BrowserStore.session<JWT>("jwt", this.jwt);

                        return true;

                    }).catch(err => {
                        console.error(err);

                        return false;
                    });
                }


                return false;

            });

    }

}