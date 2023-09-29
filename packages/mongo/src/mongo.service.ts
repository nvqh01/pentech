import {
  ConfigService,
  LogService,
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@pentech/core';
import { getModelForClass, mongoose } from '@typegoose/typegoose';
import {
  AnyParamConstructor,
  IModelOptions,
  ReturnModelType,
} from '@typegoose/typegoose/lib/types';
import { MongoConfig } from './mongo.config';

@Injectable()
export class MongoService implements OnModuleDestroy, OnModuleInit {
  @Inject()
  private readonly configService: ConfigService;

  @Inject()
  private readonly logger: LogService;

  private client: mongoose.Mongoose;
  private config: MongoConfig;
  private configKey: string;
  private context: string;

  constructor() {
    this.context = MongoService.name;
    this.configKey = 'mongo';
  }

  public async onModuleDestroy(): Promise<void> {
    await this.release();
  }

  public async onModuleInit(): Promise<void> {
    this.logger.setContext(this.context);
    await this.start();
  }

  private getConfig(): MongoConfig {
    return (
      this.config ||
      (this.config = new MongoConfig({
        ...this.configService.get<MongoConfig>(this.configKey),
        MONGO_HOST: this.configService.get<string>('MONGO_HOST'),
        MONGO_PORT: this.configService.get<string>('MONGO_PORT'),
        MONGO_USERNAME: this.configService.get<string>('MONGO_USERNAME'),
        MONGO_PASSWORD: this.configService.get<string>('MONGO_PASSWORD'),
        MONGO_DATABASE: this.configService.get<string>('MONGO_DATABASE'),
        MONGO_URI: this.configService.get<string>('MONGO_URI'),
      }))
    );
  }

  public getModel<U extends AnyParamConstructor<any>>(
    _class: U,
    options?: IModelOptions,
  ): ReturnModelType<U, any> {
    return getModelForClass(_class, options);
  }

  private async release(): Promise<void> {
    await this.client?.disconnect();
  }

  private async start(): Promise<void> {
    try {
      this.client = await mongoose.connect(
        this.getConfig().getUri(),
        this.getConfig().options,
      );

      this.client.connection.on('close', () => {
        this.logger.debug('The client is closed.');
      });

      this.client.connection.on('connected', () => {
        this.logger.debug('The client is connected.');
      });

      this.client.connection.on('disconnected', error => {
        this.logger.debug(
          'The client is disconnected with error: %j.',
          error || {},
        );
      });

      this.client.connection.on('error', error => {
        this.logger.error('The client meets error: %j', error);
      });

      this.client.connection.on('reconnected', error => {
        this.logger.debug(
          'The client is reconnected with error: %j',
          error || {},
        );
      });
    } catch (error) {
      this.logger.error('Fail to connect to the client with error: %j', error);
      process.exit(0);
    }
  }
}
