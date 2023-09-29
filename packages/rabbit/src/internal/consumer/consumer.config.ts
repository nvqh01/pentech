export class ConsumerConfig {
  public channelName: string;
  public prefetchMessages: number;
  public queue: string;

  constructor(props: Partial<ConsumerConfig>) {
    Object.assign(this, {
      ...props,
      channelName: this.getChannelName(props),
      prefetchMessages: props?.prefetchMessages || 1,
    });
  }

  private getChannelName(props: Partial<ConsumerConfig>): string {
    if (props?.channelName) return props.channelName;
    if (props?.queue) return `consumer.queue.${props.queue}`;
    return 'unknown';
  }
}
