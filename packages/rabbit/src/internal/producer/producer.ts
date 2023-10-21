import {
  ConfigService,
  Inject,
  Injectable,
  LogService,
  OnModuleDestroy,
  OnModuleInit,
} from '@pentech/core';
import { Channel, ChannelWrapper, Options } from 'amqp-connection-manager';
import { Adapter } from '../adapter';
import { ProducerConfig } from './producer.config';

type PublishOptions = Options.Publish & {
  routingKey: {
    indexOfBindingQueue: number;
  };
};

@Injectable()
export abstract class Producer<Output = any>
  implements OnModuleDestroy, OnModuleInit
{
  @Inject()
  private readonly adapter: Adapter;

  @Inject()
  private readonly configService: ConfigService;

  @Inject()
  protected readonly logger: LogService;

  private channel: ChannelWrapper;
  private config: ProducerConfig;

  constructor(protected context: string, protected configKey: string) {}

  public async onModuleDestroy(): Promise<void> {
    await this.release();
  }

  public async onModuleInit(): Promise<void> {
    this.logger.setContext(this.context);
  }

  private async createChannel(): Promise<void> {
    const config = this.getConfig();

    if (!config?.exchange && !config?.queue) {
      this.logger.error('Lack of exchange name and queue name.');
      return process.exit(0);
    }

    if (config.exchange && !config.queues.length) {
      this.logger.error('Lack of queue and routing key.');
      return process.exit(0);
    }

    this.channel = this.adapter.createChannel({
      name: config.channelName,
      confirm: true,
      setup: async (channel: Channel) => {
        if (config.exchange)
          return await Promise.all([
            channel.assertExchange(config.exchange, config.type, {
              durable: true,
            }),
            ...config.queues.map(async ({ queue, routingKey }) => {
              return await Promise.all([
                channel.assertQueue(queue, { durable: true }),
                channel.bindQueue(queue, config.exchange, routingKey),
              ]);
            }),
          ]);

        if (config.queue)
          return await Promise.all([
            channel.assertQueue(config.queue, { durable: true }),
          ]);
      },
    });

    this.channel.on('connect', () => {
      this.logger.debug(`Connected to channel "${config.channelName}".`);
    });

    this.channel.on('close', () => {
      this.logger.debug(`Closed channel "${config.channelName}".`);
    });

    this.channel.on('error', error => {
      this.logger.error(`Channel ${config.channelName} meets error: %j`, error);
    });

    await this.channel.waitForConnect();
  }

  private async release(): Promise<void> {
    await this.channel?.close();
  }

  protected getConfig(): ProducerConfig {
    return (
      this.config ||
      (this.config = new ProducerConfig(
        this.configService.get<ProducerConfig>(this.configKey),
      ))
    );
  }

  protected transform(output: Output): string {
    return JSON.stringify(output);
  }

  public getRoutingKey(indexOfBindingQueue: number): string {
    return this.getConfig().queues[indexOfBindingQueue].routingKey;
  }

  public getQueueName(): string {
    return this.getConfig().queue;
  }

  public async publish(
    output: Output | Output[],
    options: PublishOptions,
  ): Promise<void> {
    !Array.isArray(output) && (output = [output]);

    const routingKey = this.getRoutingKey(
      options.routingKey.indexOfBindingQueue,
    );
    delete options.routingKey;

    await Promise.all(
      output.map(
        async _output =>
          await this.channel.publish(
            this.getConfig().exchange,
            routingKey,
            this.transform(_output),
            {
              persistent: true,
              ...(options || {}),
            },
          ),
      ),
    );
  }

  public async sendToQueue(
    output: Output | Output[],
    options?: Options.Publish,
  ): Promise<void> {
    !Array.isArray(output) && (output = [output]);

    await Promise.all(
      output.map(
        async _output =>
          await this.channel.sendToQueue(
            this.getConfig().queue,
            this.transform(_output),
            {
              persistent: true,
              ...(options || {}),
            },
          ),
      ),
    );
  }

  public async start(): Promise<void> {
    await this.createChannel();
  }
}
