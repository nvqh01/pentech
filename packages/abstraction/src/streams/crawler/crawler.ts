import { Injectable } from '@pentech/core';
import { BasicCrawlingContext, BasicCrawlerProcessor } from '@pentech/crawler';
import { Stream } from '../stream';
import { CrawlerConfig } from './crawler.config';

@Injectable()
export abstract class Crawler<Input = any, Output = any> extends Stream<
  Input,
  Output
> {
  constructor(
    context: string,
    configKey: string,
    protected crawler: BasicCrawlerProcessor<BasicCrawlingContext>,
  ) {
    super(context, configKey);
  }

  protected getConfig(): CrawlerConfig {
    return (
      this.config ||
      (this.config = new CrawlerConfig(
        this.configService.get<CrawlerConfig>(this.configKey),
      ))
    );
  }
}
