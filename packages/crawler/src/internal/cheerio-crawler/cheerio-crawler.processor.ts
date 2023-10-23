import { Injectable } from '@pentech/core';
import {
  CheerioCrawler,
  CheerioCrawlerOptions,
  CheerioCrawlingContext,
  createCheerioRouter,
} from 'crawlee';
import { createConfiguration } from '../../utils';
import { CrawlerConfig } from '../basic-crawler';
import { HttpCrawlerProcessor } from '../http-crawler';
import { CheerioCrawlerConfig } from './cheerio-crawler.config';

@Injectable()
export abstract class CheerioCrawlerProcessor<
  Context extends CheerioCrawlingContext = CheerioCrawlingContext,
> extends HttpCrawlerProcessor<Context> {
  constructor(context: string, configKey: string) {
    super(context, configKey);
    this.router = createCheerioRouter();
  }

  protected getConfig(): CheerioCrawlerConfig {
    const proxies = this.proxyManagerService.getAllProxies({ shuffle: true });

    return (
      this.config ||
      (this.config = new CheerioCrawlerConfig({
        proxies,
        ...this.configService.get<CrawlerConfig>(this.configKey),
      }))
    );
  }

  protected initialize(): void {
    const crawlerOptions =
      this.getConfig().getCrawlerOptions() as CheerioCrawlerOptions;

    this.failedRequestHandler &&
      (crawlerOptions.failedRequestHandler = this.failedRequestHandler);

    this.crawler = new CheerioCrawler(
      {
        ...crawlerOptions,
        requestHandler: this.router,
      },
      createConfiguration(),
    );
  }
}
