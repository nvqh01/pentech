import { CrawlerConfig } from '../basic-crawler';
import { HttpCrawlerConfig } from '../http-crawler';

export class JSDOMCrawlerConfig extends HttpCrawlerConfig {
  constructor(options: CrawlerConfig) {
    super(options);
  }
}
