import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ScriptDocument = Script & Document;

@Schema()
export class Script {
  @Prop({ required: [true, 'BLANK_FIRST_NAME'] })
  email: string;

  @Prop({ required: [true, 'BLANK_FIRST_NAME'] })
  name: string;

  @Prop({ required: [true, 'BLANK_FIRST_NAME'] })
  description: string;

  @Prop({ required: [true, 'BLANK_FIRST_NAME'] })
  code: Array<string>;

  @Prop({ required: [true, 'BLANK_LAST_NAME'] })
  language: string;
}

export const ScriptSchema = SchemaFactory.createForClass(Script);

ScriptSchema.virtual('uid').get(function () {
  return this._id.toHexString();
});

ScriptSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._v;
  },
});

ScriptSchema.set('toObject', { virtuals: true });

ScriptSchema.set('timestamps', true);
ScriptSchema.set('versionKey', false);
