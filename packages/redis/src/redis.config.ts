import { RedisOptions } from 'ioredis';

export class RedisConfig {
  public REDIS_HOST: string;
  public REDIS_PORT: string;
  public REDIS_USERNAME: string;
  public REDIS_PASSWORD: string;
  public REDIS_URI: string;

  public host: string;
  public port: string;
  public username: string;
  public password: string;
  public uri: string;
  public options: RedisOptions;

  constructor(props: Partial<RedisConfig>) {
    Object.assign(this, {
      host: props?.REDIS_HOST || props?.host || '',
      port: props?.REDIS_PORT || props?.port || '',
      username: props?.REDIS_USERNAME || props?.username || '',
      password: props?.REDIS_PASSWORD || props?.password || '',
      uri: props?.REDIS_URI || props?.uri || '',
      options: props?.options || {},
    });
  }

  private buildUri(): string {
    if (!this.host || !this.port)
      throw new Error('Fail to build uri because of lack of host and port.');

    let uri = `redis://${this.host}:${this.port}`;

    if (this.username && this.password)
      uri = uri.replace(
        'redis://',
        `redis://${this.username}:${this.password}@`,
      );

    return uri;
  }

  public getUri(): string {
    return this.uri || (this.uri = this.buildUri());
  }
}
