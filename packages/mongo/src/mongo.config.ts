import { ConnectOptions } from 'mongoose';

export class MongoConfig {
  public MONGO_HOST: string;
  public MONGO_PORT: string;
  public MONGO_USERNAME: string;
  public MONGO_PASSWORD: string;
  public MONGO_DATABASE: string;
  public MONGO_URI: string;

  public host: string;
  public port: string;
  public username: string;
  public password: string;
  public database: string;
  public uri: string;
  public options: ConnectOptions;

  constructor(props: Partial<MongoConfig>) {
    Object.assign(this, {
      host: props?.MONGO_HOST || props?.host || '',
      port: props?.MONGO_PORT || props?.port || '',
      username: props?.MONGO_USERNAME || props?.username || '',
      password: props?.MONGO_PASSWORD || props?.password || '',
      database: props?.MONGO_DATABASE || props?.database || '',
      uri: props?.MONGO_URI || props?.uri || '',
      options: props?.options || {
        connectTimeoutMS: 30_000,
      },
    });
  }

  private buildUri(): string {
    if (!this.host)
      throw new Error('Fail to build uri because of lack of host.');

    if (!this.port)
      throw new Error('Fail to build uri because of lack of port.');

    if (!this.database)
      throw new Error('Fail to build uri because of lack of database.');

    let uri = `mongodb://${this.host}:${this.port}/${this.database}`;

    if (this.username && this.password)
      uri = uri.replace(
        'mongodb://',
        `mongodb://${this.username}:${this.password}@`,
      );

    return uri;
  }

  public getUri(): string {
    return this.uri || (this.uri = this.buildUri());
  }
}
