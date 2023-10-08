import { Ref, modelOptions, prop } from '@pentech/mongo';
import { Origin } from './common.model';
import { Resouce } from './resource';

@modelOptions({
  schemaOptions: {
    collection: 'dc_sources',
  },
})
export class Source extends Origin {
  @prop({ required: false })
  public created_date?: Date;

  @prop({ required: true })
  public title!: string;

  @prop({ required: false })
  public type?: string;

  // Virtual References:
  @prop({
    localField: 'id',
    foreignField: 'source',
    ref: () => Resouce,
    required: false,
    type: () => String,
  })
  public resources?: Ref<Resouce, string>[];

  @prop({
    count: true,
    localField: 'id',
    foreignField: 'source',
    ref: () => Resouce,
    required: false,
    type: () => String,
  })
  public numOfResources?: Ref<Resouce, string>[];
}
