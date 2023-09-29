import { Injectable } from '@pentech/core';
import { Stream } from '../stream';
import { BuilderConfig } from './builder.config';

@Injectable()
export abstract class Builder<Input = any, Output = any> extends Stream<
  Input,
  Output
> {
  constructor(context: string, configKey: string) {
    super(context, configKey);
  }

  protected getConfig(): BuilderConfig {
    return (
      this.config ||
      (this.config = new BuilderConfig(
        this.configService.get<BuilderConfig>(this.configKey),
      ))
    );
  }
}
