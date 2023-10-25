import {
  ConfigService,
  Inject,
  Injectable,
  LogService,
  OnModuleDestroy,
  OnModuleInit,
} from '@pentech/core';
import { Channel, ChannelWrapper } from 'amqp-connection-manager';
import { ConsumeMessage } from 'amqplib';
import { Adapter } from '../adapter';
import { ConsumerConfig } from './consumer.config';

export type ActcionBeforeRestart = (...args: any[]) => Promise<void> | void;

@Injectable()
export abstract class Consumer<Input = any>
  implements OnModuleDestroy, OnModuleInit
{
  @Inject()
  private readonly adapter: Adapter;

  @Inject()
  private readonly configService: ConfigService;

  @Inject()
  protected readonly logger: LogService;

  private actionsBeforeRestart: ActcionBeforeRestart[];
  private channel: ChannelWrapper;
  private config: ConsumerConfig;
  private messageHandler: (
    input: Input,
    msg: ConsumeMessage,
  ) => Promise<void> | void;
  private isFirstStarted: boolean;

  constructor(protected context: string, protected configKey: string) {
    this.actionsBeforeRestart = [];
    this.isFirstStarted = true;
  }

  public async onModuleDestroy(): Promise<void> {
    await this.release();
  }

  public async onModuleInit(): Promise<void> {
    this.logger.setContext(this.context);
  }

  private async createChannel(): Promise<void> {
    const config = this.getConfig();

    if (!config.queue) {
      this.logger.error('Lack of queue name.');
      return process.exit(0);
    }

    this.channel = this.adapter.createChannel({
      name: config.channelName,
      confirm: false,
      setup: async (channel: Channel) => {
        if (!this.isFirstStarted) {
          this.logger.debug('Ready to execute actions before restart.');
          for (const action of this.actionsBeforeRestart) await action();
        }

        this.isFirstStarted = false;

        return Promise.all([
          channel.assertQueue(config.queue, { durable: true }),
          channel.prefetch(config.prefetchMessages),
          channel.consume(
            config.queue,
            async (msg: ConsumeMessage | null) => {
              if (!this.messageHandler)
                throw new Error('Message handler is not implemented.');

              try {
                if (!msg) return;
                const input = this.transform(msg);
                await this.messageHandler(input, msg);
              } catch (error) {
                this.logger.error(
                  'Fail to handle message %j with error: %j',
                  msg,
                  error,
                );
                await this.reject(msg);
              }
            },
            {
              noAck: false,
            },
          ),
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

  protected getConfig(): ConsumerConfig {
    return (
      this.config ||
      (this.config = new ConsumerConfig(
        this.configService.get<ConsumerConfig>(this.configKey),
      ))
    );
  }

  protected transform(msg: ConsumeMessage): Input {
    try {
      const input = JSON.parse(msg.content.toString());
      return JSON.parse(input) as Input;
    } catch (error) {
      this.logger.error(
        'Fail to transform message %j with error: %j.',
        msg,
        error,
      );
      return null;
    }
  }

  public addActionsBeforeRestart(
    actions: ActcionBeforeRestart | ActcionBeforeRestart[],
  ): void {
    !Array.isArray(actions) && (actions = [actions]);
    this.actionsBeforeRestart.push(...actions);
  }

  public addMessageHandler(
    handler: (input: Input, msg: ConsumeMessage) => Promise<void> | void,
  ): void {
    this.messageHandler = handler;
  }

  public async commit(msg: ConsumeMessage): Promise<void> {
    this.channel.ack(msg);
  }

  public getQueueName(): string {
    return this.getConfig().queue;
  }

  public async reject(msg: ConsumeMessage): Promise<void> {
    this.channel.nack(msg);
  }

  public async start(): Promise<void> {
    await this.createChannel();
  }
}
