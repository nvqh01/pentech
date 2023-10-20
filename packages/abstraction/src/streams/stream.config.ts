export class StreamConfig {
  public cache: {
    enable: boolean;
    ttl: number;
  };
  public enable: boolean;
  public useConsumer: boolean;
  public useProducer: boolean;

  constructor(props: Partial<StreamConfig>) {
    Object.assign(this, {
      cache: {
        enable: props?.cache?.enable || false,
        ttl: props?.cache?.ttl || 2 * 24 * 60 * 60,
      },
      enable: props?.enable || false,
      useConsumer: props?.useConsumer || false,
      useProducer: props?.useProducer || false,
    });
  }
}
