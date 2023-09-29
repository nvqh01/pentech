import {
  ConfigService,
  LogService,
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@pentech/core';
import { Redis } from 'ioredis';
import { RedisConfig } from './redis.config';

@Injectable()
export class RedisService implements OnModuleDestroy, OnModuleInit {
  @Inject()
  private readonly configService: ConfigService;

  @Inject()
  private readonly logger: LogService;

  private client: Redis;
  private config: RedisConfig;
  private configKey: string;
  private context: string;

  constructor() {
    this.context = RedisService.name;
    this.configKey = 'redis';
  }

  public async onModuleDestroy(): Promise<void> {
    await this.release();
  }

  public async onModuleInit(): Promise<void> {
    this.logger.setContext(this.context);
    await this.start();
  }

  private getConfig(): RedisConfig {
    return (
      this.config ||
      (this.config = new RedisConfig({
        ...this.configService.get<RedisConfig>(this.configKey),
        REDIS_HOST: this.configService.get<string>('REDIS_HOST'),
        REDIS_PORT: this.configService.get<string>('REDIS_PORT'),
        REDIS_USERNAME: this.configService.get<string>('REDIS_USERNAME'),
        REDIS_PASSWORD: this.configService.get<string>('REDIS_PASSWORD'),
        REDIS_URI: this.configService.get<string>('REDIS_URI'),
      }))
    );
  }

  private async release(): Promise<void> {
    this.client?.quit();
  }

  private async start(): Promise<void> {
    try {
      this.client = new Redis(
        this.getConfig().getUri(),
        this.getConfig().options,
      );

      this.client.on('close', () => {
        this.logger.debug('The client is closed.');
      });

      this.client.on('connect', () => {
        this.logger.debug('The client is connected.');
      });

      this.client.on('error', error => {
        this.logger.error('The client meets error: %j', error);
      });

      this.client.on('reconnecting', (error: any) => {
        this.logger.error(
          'The client is reconnected with error: %j',
          error || {},
        );
      });
    } catch (error) {
      this.logger.error('Fail to connect to the client with error: %j', error);
      process.exit(0);
    }
  }

  public async get<T = any>(key: string): Promise<T> {
    try {
      return JSON.parse(await this.client.get(key));
    } catch (error) {
      this.logger.error(
        'Fail to get value of key %s with error: %j',
        key,
        error,
      );
      return null;
    }
  }

  public async set<T = any>(
    key: string,
    value: T,
    ttl?: number,
  ): Promise<boolean> {
    try {
      if (ttl) await this.client.set(key, JSON.stringify(value), 'EX', ttl);
      else await this.client.set(key, JSON.stringify(value));

      return true;
    } catch (error) {
      this.logger.error(
        'Fail to set value of key %s with error: %j',
        key,
        error,
      );
      return false;
    }
  }
}
