import { Ref, prop } from '@pentech/mongo';
import { Origin, SearchText } from './common.model';
import { Story } from './story.model';

export class Category extends Origin {
  @prop({ required: true })
  public name!: SearchText;

  // Virtual References:
  @prop({
    localField: 'id',
    foreignField: 'categories',
    ref: () => Story,
    required: false,
  })
  public stories?: Ref<Story, string>[];

  @prop({
    count: true,
    localField: 'id',
    foreignField: 'categories',
    ref: () => Story,
    required: false,
  })
  public numOfStories?: Ref<Story, string>[];
}
