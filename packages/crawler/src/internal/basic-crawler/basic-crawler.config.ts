import {
  BasicCrawlerOptions,
  BrowserCrawlerOptions,
  CheerioCrawlerOptions,
  HttpCrawlerOptions,
  JSDOMCrawlerOptions,
  PlaywrightCrawlerOptions,
  PuppeteerCrawlerOptions,
} from 'crawlee';

export type CrawlerOptions =
  | BasicCrawlerOptions
  | BrowserCrawlerOptions
  | CheerioCrawlerOptions
  | HttpCrawlerOptions
  | JSDOMCrawlerOptions
  | PlaywrightCrawlerOptions
  | PuppeteerCrawlerOptions;

export interface CrawlerConfig {
  crawlerOptions: CrawlerOptions;
  proxies?: string[];
  useProxy?: boolean;
}

export abstract class BasicCrawlerConfig {
  protected crawlerOptions: CrawlerOptions;

  constructor({ crawlerOptions }: CrawlerConfig) {
    this.crawlerOptions = {
      autoscaledPoolOptions: {
        loggingIntervalSecs: 600,
      },
      keepAlive: !!crawlerOptions?.keepAlive,
      maxConcurrency: crawlerOptions?.maxConcurrency || 100,
      maxRequestRetries: crawlerOptions?.maxRequestRetries || 1,
      maxRequestsPerCrawl: crawlerOptions?.maxRequestsPerCrawl || Infinity,
      maxRequestsPerMinute: crawlerOptions?.maxRequestsPerMinute || Infinity,
      maxSessionRotations: crawlerOptions?.maxSessionRotations || 10,
      minConcurrency: crawlerOptions?.minConcurrency || 1,
      requestHandlerTimeoutSecs:
        crawlerOptions?.requestHandlerTimeoutSecs || 90,
      retryOnBlocked: !!crawlerOptions?.retryOnBlocked,
      sameDomainDelaySecs: crawlerOptions?.sameDomainDelaySecs || 0,
      sessionPoolOptions: {
        blockedStatusCodes: [401, 403, 429],
        maxPoolSize: 10_000,
        sessionOptions: {
          maxAgeSecs: 3_000,
          maxUsageCount: 50,
        },
        ...(crawlerOptions?.sessionPoolOptions || {}),
      },
      useSessionPool: !!crawlerOptions?.useSessionPool,
    } as BasicCrawlerOptions;
  }

  public getCrawlerOptions(): CrawlerOptions {
    return this.crawlerOptions;
  }
}
