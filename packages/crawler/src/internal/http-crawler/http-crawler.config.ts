import { HttpCrawlerOptions, ProxyConfiguration } from 'crawlee';
import { formatProxies } from '../../utils';
import { BasicCrawlerConfig, CrawlerConfig } from '../basic-crawler';
import { ADDITIONAL_MIME_TYPES } from '../constants';

export abstract class HttpCrawlerConfig extends BasicCrawlerConfig {
  constructor(config: CrawlerConfig) {
    super(config);
    const crawlerOptions = config.crawlerOptions as HttpCrawlerOptions;

    this.crawlerOptions = {
      ...this.crawlerOptions,
      additionalMimeTypes: ADDITIONAL_MIME_TYPES,
      ignoreSslErrors: !!crawlerOptions?.ignoreSslErrors,
      navigationTimeoutSecs: crawlerOptions?.navigationTimeoutSecs || 45,
      persistCookiesPerSession: !!crawlerOptions?.persistCookiesPerSession,
      postNavigationHooks: [...(crawlerOptions?.postNavigationHooks || [])],
      preNavigationHooks: [
        ...(crawlerOptions?.preNavigationHooks || []),
        (ctx, gotoOptions) => {
          gotoOptions.headerGeneratorOptions = {
            browsers: ['chrome', 'firefox', 'safari', 'edge'],
            devices: ['desktop', 'mobile'],
            locales: ['vi-VN'],
            operatingSystems: ['android', 'ios', 'linux', 'macos', 'windows'],
          };
          gotoOptions.useHeaderGenerator = true;
        },
      ],
    } as HttpCrawlerOptions;

    if (config?.useProxy && config?.proxies && config.proxies.length)
      this.crawlerOptions = {
        ...this.crawlerOptions,
        persistCookiesPerSession: true,
        proxyConfiguration: new ProxyConfiguration({
          proxyUrls: formatProxies(config.proxies),
        }),
        useSessionPool: true,
      };
  }
}
