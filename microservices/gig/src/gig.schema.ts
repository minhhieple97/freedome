import { BaseDocument, baseSchemaOptions } from '@freedome/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
export type GigDocument = Gig & Document;
@Schema(baseSchemaOptions())
export class Gig extends BaseDocument {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  basicTitle: string;

  @Prop({ required: true })
  basicDescription: string;

  @Prop({ type: [String] })
  categories: string[];

  @Prop({ type: [String] })
  tags: string[];

  @Prop({ default: true })
  active: boolean;

  @Prop({ default: '' })
  expectedDelivery: string;

  @Prop({ default: 0 })
  ratingsCount: number;

  @Prop({ default: 0 })
  ratingSum: number;

  @Prop({
    type: {
      five: {
        value: { type: Number, default: 0 },
        count: { type: Number, default: 0 },
      },
      four: {
        value: { type: Number, default: 0 },
        count: { type: Number, default: 0 },
      },
      three: {
        value: { type: Number, default: 0 },
        count: { type: Number, default: 0 },
      },
      two: {
        value: { type: Number, default: 0 },
        count: { type: Number, default: 0 },
      },
      one: {
        value: { type: Number, default: 0 },
        count: { type: Number, default: 0 },
      },
    },
  })
  ratingCategories: Record<string, { value: number; count: number }>;

  @Prop({ default: 0 })
  price: number;

  @Prop()
  sortId: number;

  @Prop({ required: true })
  coverImage: string;
}

export const GigSchema = SchemaFactory.createForClass(Gig);
