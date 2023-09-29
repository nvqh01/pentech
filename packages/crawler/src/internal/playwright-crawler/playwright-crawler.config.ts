import { PlaywrightCrawlerOptions } from 'crawlee';
import { chromium } from 'playwright-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import { CrawlerConfig } from '../basic-crawler';
import { BrowserCrawlerConfig } from '../browser-crawler';
import { BROWSER_DEFAULT_ARGS, EXTRA_URL_PATTERNS } from '../constants';

export class PlaywrightCrawlerConfig extends BrowserCrawlerConfig {
  constructor(config: CrawlerConfig) {
    super(config);
    const crawlerOptions = config.crawlerOptions as PlaywrightCrawlerOptions;
    chromium.use(stealthPlugin());

    this.crawlerOptions = {
      ...this.crawlerOptions,
      launchContext: {
        launcher: chromium,
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
        },
      ],
    } as PlaywrightCrawlerOptions;
  }
}
