﻿import { MdDialog, MdSnackBar } from '@angular/material';
import { MsgDialog } from '~/dialogs/msg-dialog.component'

class BrowserStore {
    constructor() {

    }

    static local<T>(key: string, value?: T): T {
        return BrowserStore.processRequest<T>(window.localStorage, key, value, "Local");
    }

    static session<T>(key: string, value?: T): T {
        return BrowserStore.processRequest<T>(window.sessionStorage, key, value, "Session");
    }

    //    private static removeItemVal = {};

    static removeSessionItem = function (key) {
        window.sessionStorage.removeItem(key);
    }
    static removeLocalItem = function (key) {
        window.localStorage.removeItem(key);
    }

    private static processRequest<T>(store: Storage, key: string, value: T, storeName: string): T {

        var obj: any;

        // if value is not specified at all assume we are doing a get.
        if (value == undefined) {
            try {
                // GET
                obj = store.getItem(key);
                return StorageObject.deserialize<T>(obj);
            }
            catch (ex) {
                HandleException(ex);
                //ICE.HandleJavascriptError(ex, null, { Src: "ProcessRequest::Get", Store: storeName, Key: key, Progress: progress, RemainingSpace: store.remainingSpace/*(only supported by IE)*/ });
            }
        } else {
            try {
                //if (value === BrowserStore.removeItemVal) {
                //    store.removeItem(key);
                //    return;
                //}

                // SET
                obj = new StorageObject(value);
                store.setItem(key, JSON.stringify(obj));
            }
            catch (ex) {
                HandleException(ex);
                //ICE.HandleJavascriptError(ex, null, { Src: "ProcessRequest::Set", Store: storeName, Key: key, Value: value, Progress: progress, RemainingSpace: store.remainingSpace/*(only supported by IE)*/ });
            }
        }

    }


}



class StorageObject {

    private isValueAndObject: boolean;
    private value: any;

    constructor(val: any) {
        this.isValueAndObject = (typeof val === "object");
        this.value = val;
    }

    public static deserialize<T>(val: any): T {
        if (!val || typeof (val) === "undefined") return null;

        var obj = JSON.parse(val);
        //!if (obj.IsValueAnObject) return $.parseJSON(obj.Value);
        return obj.value;
    }

}


interface PromiseL2<R> {
    ifthen(...any): Promise<R>
}
//interface PromiseL2<T>  {
//    ifthen<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => U | Thenable<U>): Promise<U>;
//}

//declare namespace Promise {
//    function ifthen(cond:boolean, cb:(any)=>any): Promise<any>;
//}

class L2 {

    public static dialog: MdDialog;
    private static snackBar: MdSnackBar;

    public static Init(dialog: MdDialog, snackbar: MdSnackBar) {
        L2.dialog = dialog;
        L2.snackBar = snackbar;
    }

    public static Info(msg: string, title?: string) {
        L2.snackBar.open(msg, title, { duration: 2500 });
    }

    public static Success(msg: string, title?: string) {
        L2.snackBar.open(msg, title, { duration: 2500 });
    }

    public static InfoDialog(msg: string, title?: string) {
        if (!title) title = "";
        // TODO: This need to be an INFO box
        MsgDialog.exclamation(L2.dialog, title, msg);
    }

    public static Confirm(msg: string, title?: string, okayButtonLabel?: string): Promise<any> {
        return MsgDialog.confirm(L2.dialog, title, msg);
    }

    public static HandleException(e: ExceptionInformation | string | any) {
        MsgDialog.exclamation(L2.dialog, "Application error", e.toString());
    }

    public static NullToEmpty(val: string) {
        if (val == null || val == undefined) return '';
        else return val;
    }
}

enum ApiResponseType {
    Unknown = 0,
    Success = 1,
    InfoMsg = 10,
    ExclamationModal = 20,
    Error = 30,
    Exception = 40
}

class ApiResponse {
    Message: string;
    Title: string;
    Type: ApiResponseType;
    Data: any;
}

class ApiResponseEndThenChain {
    handled?: boolean;
}

//export class L2 {
//ifthen<TResult>(onfulfilled ?: (value: T) => TResult | PromiseLike < TResult >, onrejected ?: (reason: any) => void): Promise<TResult>;
(<any>Promise).prototype.ifthen = function (cond, cb) {
    //if (cond) return this.then(cb);  
    return this.then(r => {
        if (cond) return cb(r);
        else return r;
    });
}

function fetchCatch(ex) {
    if (ex instanceof ApiResponseEndThenChain) {
        ex.handled = true; //?
        // handle special case where we just threw and exception(ApiResponseEndThenChain) to end any remaining 'thens' on the promise.
        // we have to rethrow to prevent any additional '.then' callbacks from being executed
        throw ex;
    }


    // TODO: Improve error here - look for specific type of failures (eg. network related)
    MsgDialog.exclamation(L2.dialog, "fetch failed", ex.toString());

    return ex;
}

function checkHttpStatus(response: Response): Response | any {
    if (response.status >= 200 && response.status < 300) {
        return response;
    } else {
        let error: Error & { response?: any } = new Error(response.statusText)

        error.response = response;

        MsgDialog.exclamation(L2.dialog, "HTTP " + response.status, error.toString());

        throw error;

        //throw new ApiResponseEndThenChain();
    }
}


function parseJSON(response) {

    return response.json().then((json) => {
        // if still a string after parsing once...
        if (typeof (json) === "string" && json.startsWith("{")) return JSON.parse(json);

        return json;
    });
}

function processApiResponse(json): Response {
    // if the result is a string, test for ApiResponse
    if (typeof (json) === "object" && typeof (json.ApiResponseVer) !== "undefined") {

        let apiResponse = json;

        switch (apiResponse.Type) {
            case ApiResponseType.Success:
                return apiResponse;
            case ApiResponseType.InfoMsg:
                toastr.info(apiResponse.Message);
                break;
            case ApiResponseType.ExclamationModal:
                 
                MsgDialog.exclamation(L2.dialog, apiResponse.Title ? apiResponse.Title : "", apiResponse.Message);

                throw new ApiResponseEndThenChain();
            case ApiResponseType.Exception:
                MsgDialog.exclamation(L2.dialog, "Application error occured", apiResponse.Message);

                throw new ApiResponseEndThenChain();


        }


        return apiResponse;
    }
    else {
        return json;
    }

}

function fetchJson(url: string | Request, init?: RequestInit): Promise<Response> {

    return (<any>fetchWrap(url, init)
        .then(checkHttpStatus)
        .then(parseJSON)
        //.then(processApiResponse)
    )
        .ifthen(true, processApiResponse)
        .catch(fetchCatch);
}

function postJson(url: string | Request, init?: RequestInit): Promise<Response> & PromiseL2<Response> {

    var defaults = {
        method: "post",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    var settings = $.extend(defaults, init);

    return (<any>fetchWrap(url, settings)
        .then(checkHttpStatus)
        .then(parseJSON))
        .ifthen(true, processApiResponse)
        .catch(fetchCatch)

        ;
}

function putJson(url: string | Request, init?: RequestInit): Promise<Response> & PromiseL2<Response> {

    var defaults = {
        method: "put",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    var settings = $.extend(defaults, init);

    return <any>fetchWrap(url, settings)
        .then(checkHttpStatus)
        .then(parseJSON)
        .then(processApiResponse)
        //!.ifthen(true, processApiResponse)
        .catch(fetchCatch)
        ;
}

function deleteJson(url: string | Request, init?: RequestInit): Promise<Response> & PromiseL2<Response> {

    var defaults = {
        method: "delete",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    };

    var settings = $.extend(defaults, init);

    return <any>fetchWrap(url, settings)
        .then(checkHttpStatus)
        .then(parseJSON)
        .then(processApiResponse)
        //!.ifthen(true, processApiResponse)
        .catch(fetchCatch)

        ;

}

function fetchWrap(url: string | Request, init?: RequestInit): Promise<Response> & PromiseL2<Response> {

    return <any>new Promise<Response>((resolve, reject) => {

        // PL: Temp hack when we are running with ng serve
        if (window.location.port == '4200') url = 'http://localhost:9086' + url;

        var jwt = BrowserStore.session<JWT>("jwt");

        // if  a JWT exists, use it
        if (jwt != null) {

            if (!init) init = {};
            if (!init.headers) init.headers = {};

            init.headers["x-access-token"] = jwt.token;
        }

        if (!init) init = {};

        init.mode = 'cors';


        fetch(url, init).then((r: any) => {
            r.fetch = { url: url, init: init };
            resolve(r);
        })["catch"](err => {
            err.fetch = { url: url, init: init };
            reject(err);
        }).then(r => { resolve(<any>r); });
    });
}




var Info = L2.Info;
var InfoDialog = L2.InfoDialog;
var Success = L2.Success;
var Confirm = L2.Confirm;
var HandleException = L2.HandleException;
var NullToEmpty = L2.NullToEmpty;
var Init = L2.Init;

export { Init, fetchJson, postJson, putJson, deleteJson, ApiResponse, Info, InfoDialog, Success, Confirm, HandleException, NullToEmpty, BrowserStore }
//}

