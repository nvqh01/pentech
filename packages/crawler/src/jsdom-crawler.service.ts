import { Injectable, Scope } from '@pentech/core';
import { JSDOMCrawlerProcessor } from './internal';

@Injectable({ scope: Scope.TRANSIENT })
export class JSDOMCrawlerService extends JSDOMCrawlerProcessor {
  constructor() {
    super(JSDOMCrawlerService.name, 'jsdomCrawlerService');
  }
}
