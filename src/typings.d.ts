// Typings reference file, see links for more information
// https://github.com/typings/typings
// https://www.typescriptlang.org/docs/handbook/writing-declaration-files.html

declare var System: any;
declare var BootstrapDialog: any;
declare function moment(...any): any;
interface JQuery {
    validator(...any):any;
}

declare var humanizeDuration: (...any) => any;
 
interface JWT {
    token: string;
    expiresEpoch: number;
//    expiresByDate?: Date;
    
    /*access_token?: string;
    expires_in?: number; // seconds
    token_type?: string;
    refresh_token: string;

    expiresBy?: Date;*/
}

