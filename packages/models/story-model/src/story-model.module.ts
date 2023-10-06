import { Module } from '@pentech/core';
import {
  authorModelProvider,
  categoryModelProvider,
  chapterByAudioModelProvider,
  chapterByImageModelProvider,
  chapterByTextModelProvider,
  commentModelProvider,
  storyModelProvider,
} from './story-model.service';

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
export class StoryModel {}
