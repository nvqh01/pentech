import { ConfigModule, LogModule, Global, Module } from '@pentech/core';
import { ProxyManagerService } from './proxy-manager.service';

@Global()
@Module({
  imports: [ConfigModule, LogModule],
  providers: [ProxyManagerService],
  exports: [ProxyManagerService],
})
export class ProxyManagerModule {}
