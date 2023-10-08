import { Module, Global } from '@pentech/core';
import {
  resourceByImageModelProvider,
  resourceByTextModelProvider,
  resourceByVideoModelProvider,
  sourceModelProvider,
} from './data-center-model.service';

@Global()
@Module({
  imports: [],
  providers: [
    resourceByImageModelProvider,
    resourceByTextModelProvider,
    resourceByVideoModelProvider,
    sourceModelProvider,
  ],
  exports: [
    resourceByImageModelProvider,
    resourceByTextModelProvider,
    resourceByVideoModelProvider,
    sourceModelProvider,
  ],
})
export class DataCenterModelModule {}
