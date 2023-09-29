import { Injectable, Scope } from '@pentech/core';
import { PuppeteerCrawlerProcessor } from './internal';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class PuppeteerCrawlerService extends PuppeteerCrawlerProcessor {
  constructor() {
    super(PuppeteerCrawlerService.name, 'puppeteerCrawlerService');
  }
}
