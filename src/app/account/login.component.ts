import { Component, ViewEncapsulation, trigger, state, style, transition, animate, AnimationTransitionEvent, ChangeDetectorRef } from '@angular/core'
import { Router, CanDeactivate } from '@angular/router'

import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/toPromise';


import { AccountService } from '../account/account.service';
import * as L2 from '../L2'

@Component({
    selector: 'login',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './login.component.html',
    styles: [
        `
body  {
	    font-family: Helvetica;
	    background-color: #eee;
    }

md-card.login
{
    width: 380px;
    margin: auto;

}    

`, `
 
.form {
	width: 380px;
	margin: 4em auto;
	padding: 0em 2em 2em 2em;
	background: #fafafa;
	border: 1px solid #ebebeb;
	box-shadow: rgba(0,0,0,0.14902) 0px 1px 1px 0px,rgba(0,0,0,0.09804) 0px 1px 2px 0px;
}

 
`],
    animations: [
        trigger('componentState', [
            state('void', style({ opacity: 0, transform: 'translateY(-100%)' })),
            state('enterComponent', style({ opacity: 1, transform: 'translateY(0)' })),
            state('exitComponent', style({ opacity: 0.05, transform: 'translateY(200%)' })),
            transition('* => enterComponent', animate('300ms ease-in')),
            transition('enterComponent => exitComponent', animate('500ms ease-in'))


        ]),



    ],

})
export class LoginComponent implements CanDeactivate<LoginComponent> {

    private componentState: string = "enterComponent";
    private readyToGoHome$: Subject<boolean> = new Subject<boolean>();

    private checkingCredentials: boolean = true;

    private username: string;
    private password: string;
    private useWindowsAuth: boolean = false;

    private loginFailed: boolean;

    private busyWithLogin: boolean;


    constructor(private router: Router, private accountService: AccountService, private changeDetectorRef: ChangeDetectorRef) {
        try {

            // see if we can login with an existing key from localStorage
            this.accountService.loginFromStore().then(isLoggedIn => {
                
                if (isLoggedIn) {
                    this.goHome();
                    return;
                }

                // show login form
                this.checkingCredentials = false;

            }).catch(e => {
                this.checkingCredentials = false;
                console.error(e);
                L2.HandleException(e);
            });
            console.info("loginFromStore 010");

            //return;

            //fetch(`/api2/account/checkNtlm`)
            //    .then(r => {

            //        if (r.status == 401/*Unauthorised*/) {
            //            document.write("401 - Unauthorised --> Display manual login?");
            //            return;
            //        }
            //        else if (r.status == 200)
            //        {
            //            this.router.navigateByUrl("/home");
            //            return;
            //        }


            //        console.dir(r);
            //        console.info("HTTP STATUS CODE: %s", r.status);
            //        return r;
            //    });

        }
        catch (e) {
            L2.HandleException(e);
            console.error(e);
        }
    }

    animDone(event: AnimationTransitionEvent) {

        if (event.toState === "exitComponent") {
            this.readyToGoHome$.next(true);
            this.readyToGoHome$.complete();
            console.info("Exit Animation Complete!");

        }
    }


    canDeactivate(): Observable<boolean> | boolean {
        return true; // issue with 'Attempt to use a destroyed view: detectChange'
        //if (!this.accountService.isLoggedIn) return false;
        //this.componentState = "exitComponent";
        //return this.readyToGoHome$; 
    }

    private goHome() {

        this.router
            .routerState.root
            .queryParams
            .subscribe(params => {

                let targetUrl: string = "/home";

                if (this.accountService.redirectUrl) targetUrl = this.accountService.redirectUrl;
console.log("navigating to", targetUrl);
                this.router.navigateByUrl(targetUrl);

                /**this.router.navigateByUrl(targetUrl).then(r => {
                    setTimeout(() => {
                        this.changeDetectorRef.detectChanges();
                    }, 100);
                }).catch(e => {
                    alert("nav error" + e.toString());
                });**/
            }).unsubscribe();



    }

    private login() {
        try {
            this.loginFailed = false;

            this.busyWithLogin = true;

            var loginPromise = this.accountService.login({ useWindowsAuth: this.useWindowsAuth, user: this.username, pass: this.password });

            if (loginPromise) {

                loginPromise.then(success => {
                    this.busyWithLogin = false;
                    this.loginFailed = !success;

                    if (success) this.goHome();
                }).catch(e => {
                    this.busyWithLogin = false;
                    console.error(e);
                });
            }
        }
        catch (e) {
            this.busyWithLogin = false;
            console.error(e);
            L2.HandleException(e);
        }
    }

}