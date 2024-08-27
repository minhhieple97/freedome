import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class BaseDocument extends Document {
  id: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export function transformDocument(doc: any, ret: any) {
  ret.id = ret._id?.toString();
  delete ret._id;
  delete ret.__v;
  return ret;
}

export function baseSchemaOptions() {
  return {
    toJSON: {
      virtuals: true,
      transform: transformDocument,
    },
    toObject: {
      virtuals: true,
      transform: transformDocument,
    },
    timestamps: true,
  };
}
