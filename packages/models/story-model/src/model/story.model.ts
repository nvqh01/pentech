import { Ref, modelOptions, prop } from '@pentech/mongo';
import { StatusOfStory } from '../enums';
import { Author } from './author.model';
import { Category } from './category.model';
import { ChapterByAudio, ChapterByImage, ChapterByText } from './chapter.model';
import { Comment } from './comment.model';
import { FileData, Origin, SearchText } from './common.model';

@modelOptions({
  schemaOptions: {
    collection: 'stories',
  },
})
export class Story extends Origin {
  @prop({ required: false, type: () => FileData })
  public avatar?: FileData;

  @prop({ required: false })
  public createdDate?: Date;

  @prop({ default: '', required: false })
  public description?: string;

  @prop({ default: [], type: () => SearchText })
  public otherTitles?: SearchText[];

  @prop({ default: 0, required: false })
  public numOfLikes?: number;

  @prop({ default: 0, required: false })
  public numOfViews?: number;

  @prop({ enum: StatusOfStory, required: true, type: () => Number })
  public status!: StatusOfStory;

  @prop({ default: [], type: () => String })
  public tags?: string[];

  @prop({ required: true, type: () => SearchText })
  public title!: SearchText;

  // Reference Keys:
  @prop({ ref: () => Author, required: true, type: () => String })
  public authors!: Ref<Author, string>[];

  @prop({
    default: [],
    ref: () => Category,
    required: false,
    type: () => String,
  })
  public categories?: Ref<Category, string>[];

  // Virtual References:
  @prop({
    localField: 'id',
    foreignField: 'story',
    ref: () => ChapterByAudio || ChapterByImage || ChapterByText,
    required: false,
  })
  public chapters?: Ref<
    ChapterByAudio | ChapterByImage | ChapterByText,
    string
  >[];

  @prop({
    count: true,
    localField: 'id',
    foreignField: 'story',
    ref: () => ChapterByAudio || ChapterByImage || ChapterByText,
    required: false,
  })
  public numOfChapters?: Ref<
    ChapterByAudio | ChapterByImage | ChapterByText,
    string
  >[];

  @prop({
    localField: 'id',
    foreignField: 'story',
    ref: () => Comment,
    required: false,
  })
  public comments?: Ref<Comment, string>[];

  @prop({
    count: true,
    localField: 'id',
    foreignField: 'story',
    ref: () => Comment,
    required: false,
  })
  public numOfComments?: Ref<Comment, string>[];
}
