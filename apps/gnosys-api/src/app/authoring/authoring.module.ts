import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthoringController } from './authoring.controller';
import { AuthoringService } from './authoring.service';
import { Hint, HintSchema } from './schemas/hint.schema';
import { Script, ScriptSchema } from './schemas/script.schema';
import { EduMaterial, EduMaterialSchema } from './schemas/edumaterial.schema';
import { Metadata, MetadataSchema } from './schemas/metadata.schema';
import { Tags, TagsSchema } from './schemas/tags.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hint.name, schema: HintSchema }]),
    MongooseModule.forFeature([{ name: Script.name, schema: ScriptSchema }]),
    MongooseModule.forFeature([{ name: EduMaterial.name, schema: EduMaterialSchema }]),
    MongooseModule.forFeature([{ name: Metadata.name, schema: MetadataSchema }]),
    MongooseModule.forFeature([{ name: Tags.name, schema: TagsSchema }]),
  ],
  controllers: [AuthoringController],
  providers: [AuthoringService],
})
export class AuthoringModule {}
