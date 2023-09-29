import { ConfigModule, Global, LogModule, Module } from '@pentech/core';
import { RedisService } from './redis.service';

@Global()
@Module({
  imports: [ConfigModule, LogModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
