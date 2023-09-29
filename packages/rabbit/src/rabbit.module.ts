import { ConfigModule, Global, LogModule, Module } from '@pentech/core';
import { ConsumerService } from './consumer.service';
import { Adapter } from './internal';
import { ProducerService } from './producer.service';

@Global()
@Module({
  imports: [ConfigModule, LogModule],
  providers: [Adapter, ConsumerService, ProducerService],
  exports: [Adapter, ConsumerService, ProducerService],
})
export class RabbitModule {}
