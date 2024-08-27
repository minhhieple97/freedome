import { BaseDocument, baseSchemaOptions } from '@freedome/common/schemas';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema(baseSchemaOptions())
export class User extends BaseDocument {
  @Prop({ required: true, index: true, unique: true })
  userId: number;

  @Prop({ required: true, index: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  profilePublicId: string;

  @Prop({ required: true })
  emailVerified: boolean;

  @Prop({})
  country: string;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
