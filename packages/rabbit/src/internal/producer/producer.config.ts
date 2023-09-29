export class ProducerConfig {
  public channelName: string;
  public exchange: string;
  public queue: string;
  public routingKey: string;
  public type: 'direct' | 'topic' | 'headers' | 'fanout' | 'match';

  constructor(props: Partial<ProducerConfig>) {
    Object.assign(this, {
      ...props,
      channelName: this.getChannelName(props),
      type: props?.type || 'topic',
    });
  }

  private getChannelName(props: Partial<ProducerConfig>): string {
    if (props?.channelName) return props.channelName;
    if (props?.exchange) return `producer.exchange.${props.exchange}`;
    if (props?.queue) return `producer.queue.${props.queue}`;
    return 'unknown';
  }
}
