import { Ref, modelOptions, prop } from '@pentech/mongo';
import { FileData, Origin } from './common.model';
import { Source } from './source';

export class Resouce extends Origin {
  @prop({ required: false })
  public created_date?: Date;

  @prop({ required: true })
  public title!: string;

  @prop({ required: false })
  public type?: string;

  // Reference Keys:
  @prop({ ref: () => Source, required: true, type: () => String })
  public source!: Ref<Source, string>;
}

@modelOptions({
  schemaOptions: {
    collection: 'dc_resources_by_image',
  },
})
export class ResourceByImage extends Resouce {
  @prop({ required: true, type: () => FileData })
  public content!: FileData[];
}

@modelOptions({
  schemaOptions: {
    collection: 'dc_resources_by_text',
  },
})
export class ResourceByText extends Resouce {
  @prop({ required: true })
  public content!: string;
}

@modelOptions({
  schemaOptions: {
    collection: 'dc_resources_by_video',
  },
})
export class ResourceByVideo extends Resouce {
  @prop({ required: true, type: () => FileData })
  public content!: FileData[];
}
