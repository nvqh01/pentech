import { StreamConfig } from '../stream.config';

export class CrawlerConfig extends StreamConfig {
  constructor(props: Partial<CrawlerConfig>) {
    super(props);
    Object.assign(this, {
      ...props,
    });
  }
}
