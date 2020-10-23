import { L2 } from 'l2-lib/L2';
import { IApiResponse } from './../api-response';

export class blobs {

  static getStats() {
    return L2.fetchJson(`/api/blob/stats`).then((r: any) => <{ TotalItemsInCache: number, TotalBytesInCache: number }>r.Data);
  }

  static getTopN(topN: number = 20) {
    return L2.fetchJson(`/api/blob?top=${topN}`).then((r: any) => <BlobData[]>r.Data);
  }

  static getByRef(blobRef: string) {
    return L2.fetchJson(`/api/blob/${blobRef}`).then((r: any) => <BlobData>r.Data);
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
