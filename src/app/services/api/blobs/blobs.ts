import { L2 } from 'l2-lib/L2';
import { BaseApi } from '../object-model/base-api';
import { IApiResponse } from './../api-response';

export class blobs extends BaseApi {

  static getStats() {
    return this.get(`/api/blob/stats`).then((r: any) => <{ TotalItemsInCache: number, TotalBytesInCache: number }>r.Data);
  }

  static getTopN(topN: number = 20) {
    return this.get(`/api/blob?top=${topN}`).then((r: any) => <BlobData[]>r.Data);
  }

  static getByRef(blobRef: string) {
    return this.get(`/api/blob/${blobRef}`).then((r: any) => <BlobData>r.Data);
  }
}

export class BlobData {
  Ref: string;
  ContentType: string;
  ExpiryDate: Date;
  Filename: string;
  HasExpired?: boolean;
  Size: number;
}
