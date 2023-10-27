import { Module, Global } from '@pentech/core';
import { providers } from './story-model.service';

@Global()
@Module({
  imports: [],
  providers: [...providers],
  exports: [...providers],
})
export class StoryModelModule {}
