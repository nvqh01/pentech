import { Provider } from '@pentech/core';
import { ReturnModelType, getModelForClass } from '@pentech/mongo';
import {
  ResourceByImage,
  ResourceByText,
  ResourceByVideo,
  Source,
} from './models';

export const resourceByImageModelProvider: Provider = {
  provide: 'RESOURCE_BY_IMAGE_MODEL',
  useFactory(): ReturnModelType<typeof ResourceByImage, any> {
    return getModelForClass(ResourceByImage);
  },
};

export const resourceByTextModelProvider: Provider = {
  provide: 'RESOURCE_BY_TEXT_MODEL',
  useFactory(): ReturnModelType<typeof ResourceByText, any> {
    return getModelForClass(ResourceByText);
  },
};

export const resourceByVideoModelProvider: Provider = {
  provide: 'RESOURCE_BY_VIDEO_MODEL',
  useFactory(): ReturnModelType<typeof ResourceByVideo, any> {
    return getModelForClass(ResourceByVideo);
  },
};

export const sourceModelProvider: Provider = {
  provide: 'SOURCE_MODEL',
  useFactory(): ReturnModelType<typeof Source, any> {
    return getModelForClass(Source);
  },
};
