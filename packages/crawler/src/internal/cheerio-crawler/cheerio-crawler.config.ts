import { CrawlerConfig } from '../basic-crawler';
import { HttpCrawlerConfig } from '../http-crawler';

export class CheerioCrawlerConfig extends HttpCrawlerConfig {
  constructor(config: CrawlerConfig) {
    super(config);
  }
}
