import { Injectable } from '@pentech/core';
import { HttpCrawlingContext } from 'crawlee';
import { BasicCrawlerProcessor } from '../basic-crawler';

@Injectable()
export abstract class HttpCrawlerProcessor<
  Context extends HttpCrawlingContext,
> extends BasicCrawlerProcessor<Context> {
  constructor(context: string, configKey: string) {
    super(context, configKey);
  }
}
