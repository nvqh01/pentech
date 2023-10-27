import { Module, Global } from '@pentech/core';
import { providers } from './data-center-model.service';

@Global()
@Module({
  imports: [],
  providers: [...providers],
  exports: [...providers],
})
export class DataCenterModelModule {}
