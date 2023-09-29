import { AmqpConnectionManagerOptions } from 'amqp-connection-manager';

export class AdapterConfig {
  public RABBIT_HOST: string;
  public RABBIT_PORT: string;
  public RABBIT_USERNAME: string;
  public RABBIT_PASSWORD: string;
  public RABBIT_URI: string;

  public host: string;
  public port: string;
  public username: string;
  public password: string;
  public uri: string;
  public options: AmqpConnectionManagerOptions;

  constructor(props: Partial<AdapterConfig>) {
    Object.assign(this, {
      host: props?.RABBIT_HOST || props?.host || '',
      port: props?.RABBIT_PORT || props?.port || '',
      username: props?.RABBIT_USERNAME || props?.username || '',
      password: props?.RABBIT_PASSWORD || props?.password || '',
      uri: props?.RABBIT_URI || props?.uri || '',
      options: {
        connectionOptions: {
          timeout: 45_000,
        },
        heartbeatIntervalInSeconds: 5,
        reconnectTimeInSeconds: 5,
        ...(props?.options || {}),
      } as AmqpConnectionManagerOptions,
    });
  }

  private buildUri(): string {
    if (!this.host || !this.port)
      throw new Error('Fail to build uri because of lack of host and port.');

    let uri = `amqp://${this.host}:${this.port}`;

    if (this.username && this.password)
      uri = uri.replace('amqp://', `amqp://${this.username}:${this.password}@`);

    return uri;
  }

  public getUri(): string {
    return this.uri || (this.uri = this.buildUri());
  }
}
