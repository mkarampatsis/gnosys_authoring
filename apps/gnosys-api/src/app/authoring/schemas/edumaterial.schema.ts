import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EduMaterialDocument = EduMaterial & Document;

@Schema()
export class EduMaterial {
  @Prop({ required: [true, 'BLANK_FIRST_NAME'] })
  scriptid: string;

  @Prop({ required: [true, 'BLANK_FIRST_NAME'] })
  scriptname: string;

  @Prop({ required: [true, 'BLANK_FIRST_NAME'] })
  email: string;

  @Prop({ required: [true, 'BLANK_FIRST_NAME'] })
  about: string;

  @Prop({ required: [true, 'BLANK_FIRST_NAME'] })
  file: string;

  @Prop({ required: [true, 'BLANK_LAST_NAME'] })
  video: string;
}

export const EduMaterialSchema = SchemaFactory.createForClass(EduMaterial);

EduMaterialSchema.virtual('uid').get(function () {
  return this._id.toHexString();
});

EduMaterialSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._v;
  },
});

EduMaterialSchema.set('toObject', { virtuals: true });

EduMaterialSchema.set('timestamps', true);
EduMaterialSchema.set('versionKey', false);
