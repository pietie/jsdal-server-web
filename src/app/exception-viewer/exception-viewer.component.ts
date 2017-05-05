import { Component } from '@angular/core';
import L2 from "l2-lib/L2";

@Component({
    templateUrl: './exception-viewer.component.html'
})
export class ExceptionViewerComponent {

    public exceptionDetail: any;

    lookupError(errRef: string) {
        
        L2.fetchJson(`/api/exception/${errRef}`).then((r: any) => {
            console.log(r.Data.exceptionObject);
            this.exceptionDetail = r.Data;
        });
    }

    formatStackTrace(st:string)
    {
        if (!st) return null;
        return st.replace(/\n/gm,"<br/>");
    }
}