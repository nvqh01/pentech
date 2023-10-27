import { Provider } from '@pentech/core';
import { ReturnModelType, getModelForClass } from '@pentech/mongo';
import {
  Author,
  Category,
  ChapterByAudio,
  ChapterByImage,
  ChapterByText,
  Comment,
  Story,
} from './model';

export const authorModelProvider: Provider = {
  provide: 'AUTHOR_MODEL',
  useFactory(): ReturnModelType<typeof Author, any> {
    return getModelForClass(Author);
  },
};

export const categoryModelProvider: Provider = {
  provide: 'CATEGORY_MODEL',
  useFactory(): ReturnModelType<typeof Category, any> {
    return getModelForClass(Category);
  },
};

const chapterByAudioModelProvider: Provider = {
  provide: 'CHAPTER_BY_AUDIO_MODEL',
  useFactory(): ReturnModelType<typeof ChapterByAudio, any> {
    return getModelForClass(ChapterByAudio);
  },
};

const chapterByImageModelProvider: Provider = {
  provide: 'CHAPTER_BY_IMAGE_MODEL',
  useFactory(): ReturnModelType<typeof ChapterByImage, any> {
    return getModelForClass(ChapterByImage);
  },
};

const chapterByTextModelProvider: Provider = {
  provide: 'CHAPTER_BY_TEXT_MODEL',
  useFactory(): ReturnModelType<typeof ChapterByText, any> {
    return getModelForClass(ChapterByText);
  },
};

const commentModelProvider: Provider = {
  provide: 'COMMENT_MODEL',
  useFactory(): ReturnModelType<typeof Comment, any> {
    return getModelForClass(Comment);
  },
};

const storyModelProvider: Provider = {
  provide: 'STORY_MODEL',
  useFactory(): ReturnModelType<typeof Story, any> {
    return getModelForClass(Story);
  },
};

export const providers: Provider[] = [
  authorModelProvider,
  categoryModelProvider,
  chapterByAudioModelProvider,
  chapterByImageModelProvider,
  chapterByTextModelProvider,
  commentModelProvider,
  storyModelProvider,
];
