import { ConfigModule, Global, LogModule, Module } from '@pentech/core';
import { MongoService } from './mongo.service';

@Global()
@Module({
  imports: [ConfigModule, LogModule],
  providers: [MongoService],
  exports: [MongoService],
})
export class MongoModule {}
