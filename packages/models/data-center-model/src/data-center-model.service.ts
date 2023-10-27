import { Provider } from '@pentech/core';
import { ReturnModelType, getModelForClass } from '@pentech/mongo';
import {
  HybridResource,
  ResourceByImage,
  ResourceByText,
  ResourceByVideo,
  Source,
} from './models';

const hybridResourceModelProvider: Provider = {
  provide: 'HYBRID_RESOURCE_MODEL',
  useFactory(): ReturnModelType<typeof HybridResource, any> {
    return getModelForClass(HybridResource);
  },
};

const resourceByImageModelProvider: Provider = {
  provide: 'RESOURCE_BY_IMAGE_MODEL',
  useFactory(): ReturnModelType<typeof ResourceByImage, any> {
    return getModelForClass(ResourceByImage);
  },
};

const resourceByTextModelProvider: Provider = {
  provide: 'RESOURCE_BY_TEXT_MODEL',
  useFactory(): ReturnModelType<typeof ResourceByText, any> {
    return getModelForClass(ResourceByText);
  },
};

const resourceByVideoModelProvider: Provider = {
  provide: 'RESOURCE_BY_VIDEO_MODEL',
  useFactory(): ReturnModelType<typeof ResourceByVideo, any> {
    return getModelForClass(ResourceByVideo);
  },
};

const sourceModelProvider: Provider = {
  provide: 'SOURCE_MODEL',
  useFactory(): ReturnModelType<typeof Source, any> {
    return getModelForClass(Source);
  },
};

export const providers: Provider[] = [
  hybridResourceModelProvider,
  resourceByImageModelProvider,
  resourceByTextModelProvider,
  resourceByVideoModelProvider,
  sourceModelProvider,
];
