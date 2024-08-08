import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User {
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

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
