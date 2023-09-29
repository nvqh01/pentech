import {
  ConfigService,
  Inject,
  Injectable,
  LogService,
  OnModuleDestroy,
  OnModuleInit,
} from '@pentech/core';
import {
  AmqpConnectionManager,
  AmqpConnectionManagerClass,
  ChannelWrapper,
  CreateChannelOpts,
} from 'amqp-connection-manager';
import { AdapterConfig } from './adapter.config';

@Injectable()
export class Adapter implements OnModuleDestroy, OnModuleInit {
  @Inject()
  private readonly configService: ConfigService;

  @Inject()
  private readonly logger: LogService;

  private config: AdapterConfig;
  private configKey: string;
  private context: string;
  private manager: AmqpConnectionManager;

  constructor() {
    this.context = 'RabbitAdapter';
    this.configKey = 'rabbit';
  }

  public async onModuleDestroy(): Promise<void> {
    await this.release();
  }

  public async onModuleInit(): Promise<void> {
    this.logger.setContext(this.context);
    await this.start();
  }

  private async release(): Promise<void> {
    await this.manager?.close();
  }

  private async start(): Promise<void> {
    try {
      if (this.manager?.isConnected()) return;

      this.manager = new AmqpConnectionManagerClass(
        this.getConfig().getUri(),
        this.getConfig().options,
      );

      await this.manager.connect();

      this.manager.on('connect', () => {
        this.logger.debug('The client is connected.');
      });

      this.manager.on('disconnect', ({ err }) => {
        this.logger.error('The client is disconnected with error: %j', err);
      });
    } catch (error) {
      this.logger.error('Fail to connect to the client with error: %j', error);
      process.exit(0);
    }
  }

  public createChannel(options?: CreateChannelOpts): ChannelWrapper {
    const channel = this.manager.createChannel({
      json: true,
      ...(options || {}),
    });

    return channel;
  }

  private getConfig(): AdapterConfig {
    return (
      this.config ||
      (this.config = new AdapterConfig({
        ...this.configService.get<AdapterConfig>(this.configKey),
        RABBIT_HOST: this.configService.get<string>('RABBIT_HOST'),
        RABBIT_PORT: this.configService.get<string>('RABBIT_PORT'),
        RABBIT_USERNAME: this.configService.get<string>('RABBIT_USERNAME'),
        RABBIT_PASSWORD: this.configService.get<string>('RABBIT_PASSWORD'),
        RABBIT_URI: this.configService.get<string>('RABBIT_URI'),
      }))
    );
  }
}
