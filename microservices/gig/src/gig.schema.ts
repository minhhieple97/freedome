import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
@Schema({
  versionKey: false,
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
})
export class Gig extends Document {
  @Prop({ type: Types.ObjectId, index: true })
  sellerId: Types.ObjectId;

  @Prop({ required: true })
  username: string;

  @Prop({ required: true })
  profilePicture: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  basicTitle: string;

  @Prop({ required: true })
  basicDescription: string;

  @Prop({ required: true })
  categories: string;

  @Prop({ type: [String], required: true })
  subCategories: string[];

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

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const GigSchema = SchemaFactory.createForClass(Gig);

GigSchema.virtual('id').get(function (this: Gig) {
  return this._id;
});
