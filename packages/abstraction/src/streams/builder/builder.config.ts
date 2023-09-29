import { StreamConfig } from '../stream.config';

export class BuilderConfig extends StreamConfig {
  constructor(props: Partial<BuilderConfig>) {
    super(props);
    Object.assign(this, {
      ...props,
    });
  }
}
