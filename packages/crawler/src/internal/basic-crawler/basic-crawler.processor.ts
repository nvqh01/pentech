import {
  ConfigService,
  Inject,
  Injectable,
  LogService,
  OnModuleDestroy,
  OnModuleInit,
  sleep,
} from '@pentech/core';
import { ProxyManagerService } from '@pentech/proxy-manager';
import {
  BasicCrawler,
  CrawlerAddRequestsOptions,
  CrawlingContext,
  Request,
  RouterHandler,
} from 'crawlee';
import { BasicCrawlerConfig } from './basic-crawler.config';

export type ActcionBeforeRestart = (...args: any[]) => Promise<void> | void;

@Injectable()
export abstract class BasicCrawlerProcessor<Context extends CrawlingContext>
  implements OnModuleDestroy, OnModuleInit
{
  static MAX_OF_RESTARTS: number = 5;

  private actionsBeforeRestart: ActcionBeforeRestart[];
  private numOfRestarts: number;

  @Inject()
  protected readonly configService: ConfigService;

  @Inject()
  protected readonly logger: LogService;

  @Inject()
  protected readonly proxyManagerService: ProxyManagerService;

  protected config: BasicCrawlerConfig;
  protected crawler: BasicCrawler;
  protected failedRequestHandler: (ctx: Context) => Promise<void> | void;
  protected router: RouterHandler<Context>;

  protected abstract getConfig(): BasicCrawlerConfig;
  protected abstract initialize(): void;

  constructor(protected context: string, protected configKey: string) {
    this.actionsBeforeRestart = [];
    this.numOfRestarts = 0;
  }

  public async onModuleDestroy(): Promise<void> {
    await this.release();
  }

  public async onModuleInit(): Promise<void> {
    this.logger.setContext(this.context);
  }

  private isInitialized(): boolean {
    return !!this.crawler;
  }

  private async restart(isReleased: boolean = false): Promise<void> {
    await Promise.all(this.actionsBeforeRestart);

    !isReleased && (await this.release());

    if (this.numOfRestarts >= BasicCrawlerProcessor.MAX_OF_RESTARTS) {
      this.logger.error(
        `Exceeded ${BasicCrawlerProcessor.MAX_OF_RESTARTS} times to restart crawler service.`,
      );
      process.exit(0);
    }

    if (this.crawler?.running) {
      await sleep(3_000);
      return await this.restart(true);
    }

    this.numOfRestarts++;
    await sleep(3_000);
    return await this.start();
  }

  public addActionsBeforeRestart(
    actions: ActcionBeforeRestart | ActcionBeforeRestart[],
  ): void {
    !Array.isArray(actions) && (actions = [actions]);
    this.actionsBeforeRestart.push(...actions);
  }

  public addDefaultRequestHandler(
    handler: (ctx: Context) => Promise<void> | void,
  ): void {
    this.router.addDefaultHandler(handler);
  }

  public addFailedRequestHandler(
    handler: (ctx: Context) => Promise<void> | void,
  ): void {
    this.failedRequestHandler = handler;
  }

  public async addRequests(
    requests: Request[],
    options: CrawlerAddRequestsOptions = {},
    retryCount: number = 0,
  ): Promise<void> {
    await this.crawler.addRequests(requests, options).catch(async error => {
      if (retryCount >= 3) throw error;
      await sleep(3_000);
      return await this.addRequests(requests, options, retryCount + 1);
    });
  }

  public addRequestHandler(
    label: string,
    handler: (ctx: Context) => Promise<void> | void,
  ): void {
    this.router.addHandler(label, handler);
  }

  public isStarted(): boolean {
    return this.crawler.running;
  }

  public async release(): Promise<void> {
    await this.crawler?.teardown();
  }

  public setConfigKey(configKey: string): void {
    this.configKey = configKey;
  }

  public async start(requests?: Request[]): Promise<void> {
    try {
      !this.isInitialized() && this.initialize();
      await this.crawler.run(requests);
    } catch (error) {
      this.logger.error('Restart crawler service with error: %j', error);
      await this.restart();
    }
  }
}
