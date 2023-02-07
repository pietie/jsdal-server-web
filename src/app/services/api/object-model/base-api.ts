import { L2 } from 'l2-lib/L2';
import { IApiResponse } from './../api-response';

export class BaseApi {
  public static apiBaseUrl: string;

  protected static get(url: string) {
    return L2.fetchJson(this.apiBaseUrl + url);
  }

  protected static post(url: string, init: RequestInit = null) {
    return L2.postJson(this.apiBaseUrl + url, init);
  }

  protected static put(url: string, init: RequestInit = null) {
    return L2.putJson(this.apiBaseUrl + url, init);
  }

  protected static del(url: string) {
    return L2.deleteJson(this.apiBaseUrl + url);
  }
}
