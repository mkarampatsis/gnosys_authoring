import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type HintDocument = Hint & Document;

@Schema()
export class Hint {
  @Prop({ required: [true, 'BLANK_FIRST_NAME'] })
  scriptid: string;

  @Prop({ required: [true, 'BLANK_FIRST_NAME'] })
  scriptname: string;

  @Prop({ required: [true, 'BLANK_FIRST_NAME'] })
  email: string;

  @Prop({ required: [true, 'BLANK_FIRST_NAME'] })
  title: string;

  @Prop({ required: [true, 'BLANK_FIRST_NAME'] })
  description: string;

  @Prop({ required: [true, 'BLANK_LAST_NAME'] })
  code: string;
}

export const HintSchema = SchemaFactory.createForClass(Hint);

HintSchema.virtual('uid').get(function () {
  return this._id.toHexString();
});

HintSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._v;
  },
});

HintSchema.set('toObject', { virtuals: true });

HintSchema.set('timestamps', true);
HintSchema.set('versionKey', false);
