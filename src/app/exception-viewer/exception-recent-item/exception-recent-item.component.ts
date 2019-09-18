import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApiService } from '~/services/api';
import { Router } from '@angular/router';

@Component({
  selector: 'exception-recent-item',
  templateUrl: './exception-recent-item.component.html',
  styleUrls: ['./exception-recent-item.component.css']
})
export class ExceptionRecentItemComponent implements OnInit {

  @Input() exception: any;
  @Input() isLoading: boolean;

  @Input() parentId: string = null;

  @Output() onNavigating: EventEmitter<boolean> = new EventEmitter();

  isLoadingRelated: boolean = false;

  related: any;

  constructor(public api: ApiService, public router: Router) { }

  ngOnInit() {
  }

  get isRelated(): boolean {
    return this.parentId != null;
  }

  relatedBlockToggle: boolean = false;
  hasSearchedForRelated:boolean = false;

  loadRelated() {
    this.relatedBlockToggle = !this.relatedBlockToggle;
    if (this.hasSearchedForRelated) return;
    if (this.exception == null || !(this.exception.relatedCount > 0)) return;
    if (this.isRelated) return;

    this.isLoading = true;
    this.isLoadingRelated = true;

    this.api.exceptions.getRelated(this.exception.id)
      .then(r => {
        this.hasSearchedForRelated = true;
        this.isLoading = false;
        this.isLoadingRelated = false;
        this.related = r;
      })
      .catch(e => {
        this.isLoading = false;
        this.isLoadingRelated = false;
      });

  }

  private emitNavigatingEvent(val: boolean) {
    if (this.onNavigating != null) this.onNavigating.emit(val);
  }


  lookupError(errRef: string) {

    this.emitNavigatingEvent(true);

    let qp: any = {};

    if (this.isRelated) qp.parentId = this.parentId;
    else qp.parentId = null;

    this.router.navigate(['/exceptions/' + errRef], { queryParamsHandling: "merge", queryParams: qp })
      .then(r => {
        this.emitNavigatingEvent(false);
      }).catch(() => this.emitNavigatingEvent(false));
  }

  onChildNavigating(val: boolean) {
    this.emitNavigatingEvent(val);
  }


}
