import { Injectable, Scope } from '@pentech/core';
import { PlaywrightCrawlerProcessor } from './internal';

@Injectable({
  scope: Scope.TRANSIENT,
})
export class PlaywrightCrawlerService extends PlaywrightCrawlerProcessor {
  constructor() {
    super(PlaywrightCrawlerService.name, 'playwrightCrawlerService');
  }
}
