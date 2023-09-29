import { Injectable, Scope } from '@pentech/core';
import { CheerioCrawlerProcessor } from './internal';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class CheerioCrawlerService extends CheerioCrawlerProcessor {
  constructor() {
    super(CheerioCrawlerService.name, 'cheerioCrawlerService');
  }
}
