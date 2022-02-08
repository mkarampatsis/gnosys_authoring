import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TagsDocument = Tags & Document;

@Schema()
export class Tags {
  @Prop({ required: [true, 'BLANK_FIRST_NAME'] })
  email: string;

  @Prop({ required: [true, 'BLANK_FIRST_NAME'] })
  language: string;

  @Prop({ required: [true, 'BLANK_FIRST_NAME'] })
  tag: string;
}

export const TagsSchema = SchemaFactory.createForClass(Tags);

TagsSchema.virtual('uid').get(function () {
  return this._id.toHexString();
});

TagsSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._v;
  },
});

TagsSchema.set('toObject', { virtuals: true });

TagsSchema.set('timestamps', true);
TagsSchema.set('versionKey', false);
