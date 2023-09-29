import { Injectable } from '@pentech/core';
import {
  PlaywrightCrawler,
  PlaywrightCrawlerOptions,
  PlaywrightCrawlingContext,
  createPlaywrightRouter,
} from 'crawlee';
import { CrawlerConfig } from '../basic-crawler';
import { BrowserCrawlerProcessor } from '../browser-crawler';
import { PlaywrightCrawlerConfig } from './playwright-crawler.config';

@Injectable()
export abstract class PlaywrightCrawlerProcessor<
  Context extends PlaywrightCrawlingContext = PlaywrightCrawlingContext,
> extends BrowserCrawlerProcessor<Context> {
  constructor(context: string, configKey: string) {
    super(context, configKey);
    this.router = createPlaywrightRouter();
  }

  protected getConfig(): PlaywrightCrawlerConfig {
    const proxies = this.proxyManagerService.getAllProxies({ shuffle: true });

    return (
      this.config ||
      (this.config = new PlaywrightCrawlerConfig({
        proxies,
        ...this.configService.get<CrawlerConfig>(this.configKey),
      }))
    );
  }

  protected initialize(): void {
    const crawlerOptions =
      this.getConfig().getCrawlerOptions() as PlaywrightCrawlerOptions;

    this.failedRequestHandler &&
      (crawlerOptions.failedRequestHandler = this.failedRequestHandler);

    this.crawler = new PlaywrightCrawler({
      ...crawlerOptions,
      requestHandler: this.router,
    });
  }
}
