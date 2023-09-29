import { Injectable } from '@pentech/core';
import { BrowserCrawlingContext } from 'crawlee';
import { BasicCrawlerProcessor } from '../basic-crawler';

@Injectable()
export abstract class BrowserCrawlerProcessor<
  Context extends BrowserCrawlingContext,
> extends BasicCrawlerProcessor<Context> {
  constructor(context: string, configKey: string) {
    super(context, configKey);
  }
}
