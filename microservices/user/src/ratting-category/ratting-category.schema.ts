import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false })
export class RatingCategory {
  @Prop({ type: Number, default: 0 })
  value: number;

  @Prop({ type: Number, default: 0 })
  count: number;
}

export const RatingCategorySchema =
  SchemaFactory.createForClass(RatingCategory);
