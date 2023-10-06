import { Module, Global } from '@pentech/core';
import {
  authorModelProvider,
  categoryModelProvider,
  chapterByAudioModelProvider,
  chapterByImageModelProvider,
  chapterByTextModelProvider,
  commentModelProvider,
  storyModelProvider,
} from './story-model.service';

@Global()
@Module({
  imports: [],
  providers: [
    authorModelProvider,
    categoryModelProvider,
    chapterByAudioModelProvider,
    chapterByImageModelProvider,
    chapterByTextModelProvider,
    commentModelProvider,
    storyModelProvider,
  ],
  exports: [
    authorModelProvider,
    categoryModelProvider,
    chapterByAudioModelProvider,
    chapterByImageModelProvider,
    chapterByTextModelProvider,
    commentModelProvider,
    storyModelProvider,
  ],
})
export class StoryModelModule {}
