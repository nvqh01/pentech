import { PuppeteerCrawlerOptions } from 'crawlee';
import puppeteerExtra from 'puppeteer-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import { CrawlerConfig } from '../basic-crawler';
import { BrowserCrawlerConfig } from '../browser-crawler';
import { BROWSER_DEFAULT_ARGS, EXTRA_URL_PATTERNS } from '../constants';

export class PuppeteerCrawlerConfig extends BrowserCrawlerConfig {
  constructor(config: CrawlerConfig) {
    super(config);
    const crawlerOptions = config.crawlerOptions as PuppeteerCrawlerOptions;
    puppeteerExtra.use(stealthPlugin());

    this.crawlerOptions = {
      ...this.crawlerOptions,
      launchContext: {
        launcher: puppeteerExtra,
        launchOptions: {
          args: BROWSER_DEFAULT_ARGS,
          ignoreHTTPSErrors: true,
          userDataDir: './cache',
        },
        useChrome: false,
        useIncognitoPages: false,
        ...(crawlerOptions?.launchContext || {}),
      },
      postNavigationHooks: [...(crawlerOptions?.postNavigationHooks || [])],
      preNavigationHooks: [
        ...(crawlerOptions?.preNavigationHooks || []),
        async (ctx, gotoOptions) => {
          await ctx.blockRequests({
            extraUrlPatterns: [...EXTRA_URL_PATTERNS],
          });

          await ctx.page.setExtraHTTPHeaders({
            'accept-encoding': 'gzip, deflate, br',
          });

          if (ctx?.proxyInfo) {
            const { username, password } = ctx.proxyInfo;
            await ctx.page.authenticate({ username, password });
          }

          gotoOptions.waitUntil = 'domcontentloaded';
        },
      ],
    } as PuppeteerCrawlerOptions;
  }
}
