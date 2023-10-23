import { Injectable } from '@pentech/core';
import {
  PuppeteerCrawler,
  PuppeteerCrawlerOptions,
  PuppeteerCrawlingContext,
  createPuppeteerRouter,
} from 'crawlee';
import { createConfiguration } from '../../utils';
import { CrawlerConfig } from '../basic-crawler';
import { BrowserCrawlerProcessor } from '../browser-crawler';
import { PuppeteerCrawlerConfig } from './puppeteer-crawler.config';

@Injectable()
export abstract class PuppeteerCrawlerProcessor<
  Context extends PuppeteerCrawlingContext = PuppeteerCrawlingContext,
> extends BrowserCrawlerProcessor<Context> {
  constructor(context: string, configKey: string) {
    super(context, configKey);
    this.router = createPuppeteerRouter();
  }

  protected getConfig(): PuppeteerCrawlerConfig {
    const proxies = this.proxyManagerService.getAllProxies({ shuffle: true });

    return (
      this.config ||
      (this.config = new PuppeteerCrawlerConfig({
        proxies,
        ...this.configService.get<CrawlerConfig>(this.configKey),
      }))
    );
  }

  protected initialize(): void {
    const crawlerOptions =
      this.getConfig().getCrawlerOptions() as PuppeteerCrawlerOptions;

    this.failedRequestHandler &&
      (crawlerOptions.failedRequestHandler = this.failedRequestHandler);

    this.crawler = new PuppeteerCrawler(
      {
        ...crawlerOptions,
        requestHandler: this.router,
      },
      createConfiguration(),
    );
  }
}
