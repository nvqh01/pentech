import { StreamConfig } from '../stream.config';

export class ResolverConfig extends StreamConfig {
  constructor(props: Partial<ResolverConfig>) {
    super(props);
    Object.assign(this, {
      ...props,
    });
  }
}
