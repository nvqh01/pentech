import {
  ConfigService,
  LogService,
  Inject,
  Injectable,
  OnModuleInit,
} from '@pentech/core';
import { ProxyManagerConfig } from './proxy-manager.config';

@Injectable()
export class ProxyManagerService implements OnModuleInit {
  @Inject()
  private readonly configService: ConfigService;

  @Inject()
  private readonly logger: LogService;

  private config: ProxyManagerConfig;
  private configKey: string;
  private context: string;
  private index: number;

  constructor() {
    this.configKey = 'proxyManagerService';
    this.context = ProxyManagerService.name;
    this.index = 0;
  }

  public onModuleInit(): void {
    this.logger.setContext(this.context);
  }

  private formatProxies(proxies: string[]): string[] {
    return proxies.map(proxy => {
      const [host, port, username, password] = proxy.split(':');
      return `http://${username}:${password}@${host}:${port}`;
    });
  }

  private getConfig(): ProxyManagerConfig {
    return (
      this.config ||
      (this.config = new ProxyManagerConfig(
        this.configService.get<ProxyManagerConfig>(this.configKey),
      ))
    );
  }

  public getAllProxies(options?: {
    format?: boolean;
    shuffle?: boolean;
  }): string[] {
    let proxies = [...this.getConfig().proxies];

    options?.shuffle && (proxies = proxies.sort(() => Math.random() - 0.5));

    return options?.format ? this.formatProxies(proxies) : proxies;
  }

  public getProxy(format?: boolean): string {
    const proxies = this.getConfig().proxies;
    const proxy = proxies[this.index++ % proxies.length];
    return format ? this.formatProxies([proxy])[0] : proxy;
  }
}
