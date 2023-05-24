import { Component } from '@angular/core'
import { L2 } from 'l2-lib/L2';
import { ApiService } from '~/services/api';

@Component({
  selector: 'Settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class Settings {

  availableCerts: any;

  bindings: BindingEntry[] = [{ enabled: true, hostname: 'localhost', port: 9086 }, { enabled: false, port: 443 }];

  constructor(public api: ApiService) {

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
        L2.info("Bindings updated successfully. Please restart service for changes to take effect.");
      });

    }
    catch (e) {
      L2.handleException(e);
    }
  }

  compareCerts(o1, o2) {
    return o1?.cert?.Thumbprint?.toLowerCase() == o2?.cert?.Thumbprint?.toLowerCase();
  }

}

class BindingEntry {
  public enabled: boolean;
  public hostname?: string;
  public port?: number;
  public certThumb?: string;
  public cert?: any;
}
