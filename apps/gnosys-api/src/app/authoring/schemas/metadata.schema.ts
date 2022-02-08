import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MetadataDocument = Metadata & Document;

@Schema()
export class Metadata {
  @Prop({ required: [true, 'BLANK_FIRST_NAME'] })
  scriptid: string;

  @Prop({ required: [true, 'BLANK_FIRST_NAME'] })
  scriptname: string;

  @Prop({ required: [true, 'BLANK_FIRST_NAME'] })
  email: string;

  @Prop({ required: [true, 'BLANK_FIRST_NAME'] })
  linesofcode: string;

  @Prop({ required: [true, 'BLANK_FIRST_NAME'] })
  timetosolve: string;

  @Prop({ required: [true, 'BLANK_LAST_NAME'] })
  numofif: string;

  @Prop({ required: [true, 'BLANK_LAST_NAME'] })
  numoffor: string;

  @Prop({ required: [true, 'BLANK_LAST_NAME'] })
  tags: Array<{ id: string, name: string }>;
}

export const MetadataSchema = SchemaFactory.createForClass(Metadata);

MetadataSchema.virtual('uid').get(function () {
  return this._id.toHexString();
});

MetadataSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._v;
  },
});

MetadataSchema.set('toObject', { virtuals: true });

MetadataSchema.set('timestamps', true);
MetadataSchema.set('versionKey', false);
