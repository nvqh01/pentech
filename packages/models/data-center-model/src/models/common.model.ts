import { getCurrentDate } from '@pentech/core';
import { modelOptions, mongoose, prop } from '@pentech/mongo';
import { CrawlingStatus } from '../enums';

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

  @prop({ default: getCurrentDate(), required: false })
  public crawled_date?: Date;

  @prop({ enum: CrawlingStatus, required: false, type: () => Number })
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
}

@modelOptions({
  schemaOptions: {
    ...commonSchemaOptions,
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
