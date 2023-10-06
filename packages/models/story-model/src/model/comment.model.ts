import { Ref, modelOptions, prop } from '@pentech/mongo';
import { Author } from './author.model';
import { ChapterByAudio, ChapterByImage, ChapterByText } from './chapter.model';
import { FileData, Origin } from './common.model';
import { Story } from './story.model';

@modelOptions({
  schemaOptions: {
    collection: 'comments',
  },
})
export class Comment extends Origin {
  @prop({ required: true, type: () => FileData || String })
  public content: (FileData | string)[];

  @prop({ default: 0, required: false })
  public numOfLikes?: number;

  @prop({ default: 0, required: false })
  public numOfViews?: number;

  // Reference Keys:
  @prop({ ref: () => Author, required: true, type: () => String })
  public user!: Ref<Author, string>;

  @prop({ ref: () => Story, required: true, type: () => String })
  public story!: Ref<Story, string>;

  @prop({
    ref: () => ChapterByAudio || ChapterByImage || ChapterByText,
    required: true,
    type: () => String,
  })
  public chapter!: Ref<ChapterByAudio | ChapterByImage | ChapterByText, string>;

  @prop({ default: null, ref: () => Comment, type: () => String })
  public comment?: Ref<Comment, string>;

  // Virtual References:
  @prop({
    localField: 'id',
    foreignField: 'comment',
    ref: () => Comment,
    required: false,
  })
  public comments?: Ref<Comment, string>[];

  @prop({
    count: true,
    localField: 'id',
    foreignField: 'comment',
    ref: () => Comment,
    required: false,
  })
  public numOfComments?: Ref<Comment, string>[];
}
