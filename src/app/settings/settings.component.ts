import { Component } from '@angular/core'
import { L2 } from 'l2-lib/L2';
import { ApiService } from '~/services/api';

@Component({
    selector: 'Settings',
    templateUrl: './settings.component.html'
})
export class Settings {

    availableCerts: any;

    bindings: BindingEntry[] = [{ enabled: true, hostname: 'localhost', port: 9086 }, { enabled: false, port: 443 }];

    constructor(public api:ApiService) {

      this.api.get('/api/settings/bindings').then((r: any) => {
            //console.log("bindings", r.Data);
            this.bindings = r.Data;
        });

        this.availableCerts = this.api.get('/api/settings/certs').then((json: any) => {
            //this.perfraw = json.Data;
            return json.Data;
        });
    }

    saveBindings() {
        try {

          this.api.post(`/api/settings/bindings`, { body: JSON.stringify(this.bindings) }).then(r => {
                L2.success("Done!?");
            });

        }
        catch (e) {
            L2.handleException(e);
        }
    }

}

class BindingEntry {
    public enabled: boolean;
    public hostname?: string;
    public port?: number;
    public certThumb?: string;
}
