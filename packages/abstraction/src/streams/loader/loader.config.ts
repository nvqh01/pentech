import { StreamConfig } from '../stream.config';

export class LoaderConfig extends StreamConfig {
  constructor(props: Partial<LoaderConfig>) {
    super(props);
    Object.assign(this, {
      ...props,
    });
  }
}
