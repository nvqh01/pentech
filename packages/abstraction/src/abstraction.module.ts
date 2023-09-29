import { Global, Module } from '@pentech/core';
import { CrawlerModule } from '@pentech/crawler';
import { MongoModule } from '@pentech/mongo';
import { ProxyManagerModule } from '@pentech/proxy-manager';
import { RabbitModule } from '@pentech/rabbit';
import { RedisModule } from '@pentech/redis';

@Global()
@Module({
  imports: [
    CrawlerModule,
    MongoModule,
    ProxyManagerModule,
    RabbitModule,
    RedisModule,
  ],
  providers: [],
  exports: [],
})
export class AbstractionModule {}
