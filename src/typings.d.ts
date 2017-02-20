// Typings reference file, see links for more information
// https://github.com/typings/typings
// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html

/// <reference path="../typings/tsd.d.ts" />

declare var System: any;
declare var BootstrapDialog: any;

interface JQuery {
    validator(...any):any;
}

declare var humanizeDuration: (...any) => any;

interface JWT {
    access_token?: string;
    expires_in?: number; // seconds
    token_type?: string;
    refresh_token: string;

    expiresBy?: Date;
}

declare var require: any;