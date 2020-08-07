import { Component, OnInit } from '@angular/core';
import { ApiService } from '~/services/api';
import { L2 } from 'l2-lib/L2';
import { BlobData } from '~/services/api/blobs';

@Component({
  selector: 'app-blob-viewer',
  templateUrl: './blob-viewer.component.html',
  styleUrls: ['./blob-viewer.component.css']
})
export class BlobViewerComponent implements OnInit {

  constructor(public api: ApiService) { }

  searchBlobRef: string;

  blobStats: { TotalItemsInCache: number, TotalBytesInCache: number };
  searchResults: BlobData[];

  async ngOnInit() {
    try {
      this.refreshStats();

      this.searchResults = await this.api.blobs.getTopN(20);
    }
    catch (e) {
      L2.handleException(e);
    }
  }

  async refreshStats() {
    this.blobStats = await this.api.blobs.getStats();
  }

  search() {
    try {
      this.api.blobs.getByRef(this.searchBlobRef);
    }
    catch (e) {
      L2.handleException(e);
    }
  }

}
