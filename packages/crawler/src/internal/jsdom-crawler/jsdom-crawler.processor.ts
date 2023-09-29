import { Injectable } from '@pentech/core';
import {
  JSDOMCrawler,
  JSDOMCrawlerOptions,
  JSDOMCrawlingContext,
  createJSDOMRouter,
} from 'crawlee';
import { CrawlerConfig } from '../basic-crawler';
import { HttpCrawlerProcessor } from '../http-crawler';
import { JSDOMCrawlerConfig } from './jsdom-crawler.config';

@Injectable()
export abstract class JSDOMCrawlerProcessor<
  Context extends JSDOMCrawlingContext = JSDOMCrawlingContext,
> extends HttpCrawlerProcessor<Context> {
  constructor(context: string, configKey: string) {
    super(context, configKey);
    this.router = createJSDOMRouter();
  }

  protected getConfig(): JSDOMCrawlerConfig {
    const proxies = this.proxyManagerService.getAllProxies({ shuffle: true });

    return (
      this.config ||
      (this.config = new JSDOMCrawlerConfig({
        proxies,
        ...this.configService.get<CrawlerConfig>(this.configKey),
      }))
    );
  }

  protected initialize(): void {
    const crawlerOptions =
      this.getConfig().getCrawlerOptions() as JSDOMCrawlerOptions;

    this.failedRequestHandler &&
      (crawlerOptions.failedRequestHandler = this.failedRequestHandler);

    this.crawler = new JSDOMCrawler({
      ...crawlerOptions,
      requestHandler: this.router,
    });
  }
}
