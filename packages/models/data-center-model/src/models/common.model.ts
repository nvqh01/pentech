import { modelOptions, mongoose, prop } from '@pentech/mongo';
import { CrawlingStatus, Language, TypeOfFile } from '../enums';

export const commonSchemaOptions: mongoose.SchemaOptions = {
  _id: false,
  timestamps: false,
  versionKey: false,
};

@modelOptions({
  schemaOptions: commonSchemaOptions,
})
export class CrawlingInfo {
  @prop({ required: false })
  public checksum?: string;

  @prop({ required: true })
  public crawled_date!: Date;

  @prop({
    default: CrawlingStatus.IDLE,
    enum: CrawlingStatus,
    required: false,
    type: () => Number,
  })
  public crawling_status?: CrawlingStatus;

  @prop({ required: true })
  public crawling_url!: string;

  @prop({ required: true })
  public domain!: string;

  @prop({ required: false })
  public next_crawling_date?: Date;
}

@modelOptions({
  schemaOptions: commonSchemaOptions,
})
export class FileData {
  @prop({ required: false })
  public index?: number;

  @prop({ default: false, required: false })
  public isSaved?: boolean;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public origin_url!: string;

  @prop({ required: true })
  public path!: string;

  @prop({ enum: TypeOfFile, required: false, type: () => String })
  public type?: TypeOfFile;
}

@modelOptions({
  schemaOptions: commonSchemaOptions,
})
export class HybridData {
  @prop({ required: false, type: () => FileData })
  public images?: FileData[];

  @prop({ required: false, type: () => String })
  public text?: string[];

  @prop({ required: false, type: () => FileData })
  public video?: FileData[];
}

@modelOptions({
  schemaOptions: {
    ...commonSchemaOptions,
    _id: true,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class Origin {
  @prop({ index: true, required: true, unique: true })
  public id!: string;

  @prop({ required: true, type: () => CrawlingInfo })
  public crawlingInfo!: CrawlingInfo;

  @prop({ index: true, required: false })
  public deleted_date?: Date;

  @prop({
    default: () => Language.UNKNOWN,
    enum: Language,
    index: true,
    required: false,
    type: () => Number,
  })
  public language?: Language;
}

@modelOptions({
  schemaOptions: commonSchemaOptions,
})
export class SearchText {
  @prop({ required: true })
  public unicodeText!: string;

  @prop({ required: true })
  public asciiText!: string;
}
