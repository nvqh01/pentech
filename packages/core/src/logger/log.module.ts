import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '../config';
import { LogService } from './log.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
