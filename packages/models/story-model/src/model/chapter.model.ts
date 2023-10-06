import { Ref, modelOptions, prop } from '@pentech/mongo';
import { FileData, Origin, SearchText } from './common.model';
import { Story } from './story.model';

class Chapter extends Origin {
  @prop({ required: false })
  public chapter?: number;

  @prop({ required: false })
  public chapterName?: SearchText;

  @prop({ required: false })
  public createdDate?: Date;

  @prop({ default: 0, required: false })
  public numOfLikes?: number;

  @prop({ default: 0, required: false })
  public numOfViews?: number;

  // Reference Keys:
  @prop({ ref: () => Story, required: true, type: () => String })
  public story!: Ref<Story, string>;

  // Virtual References:
  @prop({
    foreignField: 'chapter',
    localField: 'id',
    ref: () => Comment,
    required: false,
  })
  public comments?: Ref<Comment, string>[];

  @prop({
    count: true,
    foreignField: 'chapter',
    localField: 'id',
    ref: () => Comment,
    required: false,
  })
  public numOfComments?: Ref<Comment, string>[];
}

@modelOptions({
  schemaOptions: {
    collection: 'chapters_by_audio',
  },
})
export class ChapterByAudio extends Chapter {
  @prop({ required: true, type: () => FileData })
  public content!: FileData[];
}

@modelOptions({
  schemaOptions: {
    collection: 'chapters_by_image',
  },
})
export class ChapterByImage extends Chapter {
  @prop({ required: true, type: () => FileData })
  public content!: FileData[];
}

@modelOptions({
  schemaOptions: {
    collection: 'chapters_by_text',
  },
})
export class ChapterByText extends Chapter {
  @prop({ required: true })
  public content!: string;
}
