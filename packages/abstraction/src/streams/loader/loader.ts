import { Injectable } from '@pentech/core';
import { BasicCrawlingContext, BasicCrawlerProcessor } from '@pentech/crawler';
import { Stream } from '../stream';
import { LoaderConfig } from './loader.config';

@Injectable()
export abstract class Loader<Input = any, Output = any> extends Stream<
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

  protected getConfig(): LoaderConfig {
    return (
      this.config ||
      (this.config = new LoaderConfig(
        this.configService.get<LoaderConfig>(this.configKey),
      ))
    );
  }
}
