import { BrowserCrawlerOptions, ProxyConfiguration } from 'crawlee';
import { formatProxies } from '../../utils';
import { BasicCrawlerConfig, CrawlerConfig } from '../basic-crawler';

export abstract class BrowserCrawlerConfig extends BasicCrawlerConfig {
  constructor(config: CrawlerConfig) {
    super(config);
    const crawlerOptions = config.crawlerOptions as BrowserCrawlerOptions;

    this.crawlerOptions = {
      ...this.crawlerOptions,
      browserPoolOptions: {
        fingerprintOptions: {
          fingerprintGeneratorOptions: {
            browsers: ['chrome', 'firefox', 'safari', 'edge'] as any,
            devices: ['desktop', 'mobile'] as any,
            locales: ['vi-VN'],
            operatingSystems: [
              'android',
              'ios',
              'linux',
              'macos',
              'windows',
            ] as any,
          },
          useFingerprintCache: true,
        },
        useFingerprints: true,
        ...(crawlerOptions?.browserPoolOptions || {}),
      },
      headless: !!crawlerOptions?.headless,
      navigationTimeoutSecs: crawlerOptions?.navigationTimeoutSecs || 45,
      persistCookiesPerSession: !crawlerOptions?.persistCookiesPerSession,
    } as BrowserCrawlerOptions;

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
