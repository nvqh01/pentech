import { DocumentType, Ref, modelOptions, prop } from '@pentech/mongo';
import bcrypt from 'bcrypt';
import { Sex, TypeOfStory } from '../enums';
import { FileData, Origin, SearchText } from './common.model';
import { Story } from './story.model';

@modelOptions({
  schemaOptions: {
    collection: 'authors',
  },
})
export class Author extends Origin {
  @prop({ required: false, type: () => FileData })
  public avatar?: FileData;

  @prop({ required: false })
  public birth_of_date?: Date;

  @prop({ required: false })
  public country?: string;

  @prop({ required: true, type: () => SearchText })
  public name!: SearchText;

  @prop({ maxlength: 14, minlength: 7, required: true })
  public password!: string;

  @prop({ enum: TypeOfStory, required: true, type: () => Number })
  public typeOfStory!: TypeOfStory;

  @prop({ enum: Sex, required: false, type: () => Number })
  public sex?: Sex;

  @prop({
    index: true,
    maxlength: 14,
    minlength: 7,
    required: true,
    unique: true,
  })
  public username!: string;

  public async isValidPassword(
    this: DocumentType<Author>,
    hashPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(hashPassword, this.password);
  }

  public static async hashPassword(plainPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(plainPassword, salt);
    return hashPassword;
  }

  // Virtual References:
  @prop({
    localField: 'id',
    foreignField: 'authors',
    ref: () => Story,
    required: false,
    type: () => String,
  })
  public stories?: Ref<Story, string>[];

  @prop({
    count: true,
    localField: 'id',
    foreignField: 'authors',
    ref: () => Story,
    required: false,
    type: () => String,
  })
  public numOfStories?: Ref<Story, string>[];
}
