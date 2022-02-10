import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Hint, HintDocument } from './schemas/hint.schema';
import { CreateHintDto } from './dto/hint.dto';

import { Script, ScriptDocument } from './schemas/script.schema';
import { CreateScriptDto } from './dto/script.dto';

import { EduMaterial, EduMaterialDocument } from './schemas/edumaterial.schema';
import { CreateEduMaterialDto } from './dto/edumaterial.dto';

import { Metadata, MetadataDocument } from './schemas/metadata.schema';
import { CreateMetadataDto } from './dto/metadata.dto';

import { Tags, TagsDocument } from './schemas/tags.schema';
import { CreateTagsDto } from './dto/tags.dto';

@Injectable()
export class AuthoringService {
    
    constructor( 
        @InjectModel(Hint.name) private hintModel: Model<HintDocument>,
        @InjectModel(Script.name) private scriptModel: Model<ScriptDocument>,
        @InjectModel(EduMaterial.name) private eduMaterialModel: Model<EduMaterialDocument>,
        @InjectModel(Metadata.name) private metadataModel: Model<MetadataDocument>,
        @InjectModel(Tags.name) private tagsModel: Model<TagsDocument>
    ) {}
    
    // Scripts
    async createScript(createScriptDto: CreateScriptDto): Promise<ScriptDocument> {
        const createdScript = new this.scriptModel(createScriptDto);
        return await createdScript.save();
    }

    async updateScript(sriptId: string, email: string, name: string, description: string, code: string[], language: string){
        const updatedScript = await this.findScript(sriptId)
        
        if (email){
            updatedScript.email=email;
        }
        if (name){
            updatedScript.name=name;
        }
        if (description){
            updatedScript.description=description;
        }
        if (code){
            updatedScript.code=code;
        }
        if (language){
            updatedScript.language=language;
        }
        updatedScript.save();
    }

    async deleteScript(scriptId: string){
        const result = await this.scriptModel.deleteOne({_id: scriptId}).exec();
        if (result.deletedCount === 0){
            throw new NotFoundException('Could not find Script');
        }
     }

    async getScripts(email: string): Promise<ScriptDocument[]> {
        return this.scriptModel.find({'email': email}).exec();
    }

    private async findScript(id: string): Promise<ScriptDocument> {
        let result;
        try{
            result = await this.scriptModel.findById(id);
        } catch (error){
            throw new NotFoundException('No result');
        }
        if (!result){
            throw new NotFoundException('No result');
        }
        return result;
    }

    // Hints
    async createHint(createHintDto: CreateHintDto): Promise<HintDocument> {
        const createdHint = new this.hintModel(createHintDto);
        return await createdHint.save();
    }

    async getHints(email: string): Promise<HintDocument[]> {
        return this.hintModel.find({'email': email}).exec();
    }
    
    async getHint(hintId: string): Promise<HintDocument> {
        return this.findHint(hintId);
    }

    async updateHint(hintId: string, scriptid: string, scriptname: string, title: string, descr: string, code: string ){
        const updatedHint = await this.findHint(hintId)
        
        if (scriptid){
            updatedHint.scriptid=scriptid;
        }
        if (scriptname){
            updatedHint.scriptname=scriptname;
        }
        if (title){
            updatedHint.title=title;
        }
        if (descr){
            updatedHint.description=descr;
        }
        if (code){
            updatedHint.code=code;
        }
        updatedHint.save();
    }

    async deleteHint(hintId: string){
       const result = await this.hintModel.deleteOne({_id: hintId}).exec();
       if (result.deletedCount === 0){
           throw new NotFoundException('Could not find Hint');
       }
    }

    private async findHint(id: string): Promise<HintDocument> {
        let result;
        try{
            result = await this.hintModel.findById(id);
        } catch (error){
            throw new NotFoundException('No result');
        }
        if (!result){
            throw new NotFoundException('No result');
        }
        return result;
    }  
    
    // EduMaterial
    async createEduMaterial(createEduMaterialDto: CreateEduMaterialDto): Promise<EduMaterialDocument> {
        const createdEduMaterial = new this.eduMaterialModel(createEduMaterialDto);
        return await createdEduMaterial.save();
    }

    async getEduMaterials(email: string): Promise<EduMaterialDocument[]> {
        return this.eduMaterialModel.find({'email': email}).exec();
    }
    
    async getEduMaterial(Id: string): Promise<EduMaterialDocument> {
        return this.findEduMaterial(Id);
    }

    async updateEduMaterial(Id: string, scriptid: string, scriptname: string, about: string, file: string, video: string ){
        const updatedEduMaterial = await this.findEduMaterial(Id)
        
        if (scriptid){
            updatedEduMaterial.scriptid=scriptid;
        }
        if (scriptname){
            updatedEduMaterial.scriptname=scriptname;
        }
        if (about){
            updatedEduMaterial.about=about;
        }
        if (file){
            updatedEduMaterial.file=file;
        }
        if (video){
            updatedEduMaterial.video=video;
        }
        updatedEduMaterial.save();
    }

    async deleteEduMaterial(Id: string){
       const result = await this.eduMaterialModel.deleteOne({_id: Id}).exec();
       if (result.deletedCount === 0){
           throw new NotFoundException('Could not find Material');
       }
    }

    private async findEduMaterial(id: string): Promise<EduMaterialDocument> {
        let result;
        try{
            result = await this.eduMaterialModel.findById(id);
        } catch (error){
            throw new NotFoundException('No result');
        }
        if (!result){
            throw new NotFoundException('No result');
        }
        return result;
    }

    // Metadata
    async createMetadata(createMetadataDto: CreateMetadataDto): Promise<MetadataDocument> {
        const createdMetadata = new this.metadataModel(createMetadataDto);
        return await createdMetadata.save();
    }

    async getMetadatas(email: string): Promise<MetadataDocument[]> {
        return this.metadataModel.find({'email': email}).exec();
    }
    
    async getMetadata(Id: string): Promise<MetadataDocument> {
        return this.findMetadata(Id);
    }

    async updateMetadata(Id: string, scriptid: string, scriptname: string, linesofcode: string, timetosolve: string, numofif: string, numoffor: string, tags: { id: string; name: string; }[] ){
        const updatedMetadata = await this.findMetadata(Id)
        
        if (scriptid){
            updatedMetadata.scriptid=scriptid;
        }
        if (scriptname){
            updatedMetadata.scriptname=scriptname;
        }
        if (linesofcode){
            updatedMetadata.linesofcode=linesofcode;
        }
        if (timetosolve){
            updatedMetadata.timetosolve=timetosolve;
        }
        if (numofif){
            updatedMetadata.numofif=numofif;
        }
        if (numoffor){
            updatedMetadata.numoffor=numoffor;
        }
        if (tags){
            updatedMetadata.tags=tags;
        }
        updatedMetadata.save();
    }

    async deleteMetadata(Id: string){
       const result = await this.metadataModel.deleteOne({_id: Id}).exec();
       if (result.deletedCount === 0){
           throw new NotFoundException('Could not find Metadata');
       }
    }

    private async findMetadata(id: string): Promise<MetadataDocument> {
        let result;
        try{
            result = await this.metadataModel.findById(id);
        } catch (error){
            throw new NotFoundException('No result');
        }
        if (!result){
            throw new NotFoundException('No result');
        }
        return result;
    }

    // Tags
    async createTag(createTagsDto: CreateTagsDto): Promise<TagsDocument> {
        console.log(createTagsDto);
        const createdTag = new this.tagsModel(createTagsDto);
        return await createdTag.save();
    }

    async getTags(email: string): Promise<TagsDocument[]> {
        return this.tagsModel.find({'email': email}).exec();
    }
    
    async getTag(Id: string): Promise<TagsDocument> {
        return this.findTag(Id);
    }

    async updateTag(Id: string, language: string, tag: string ){
        const updatedTag = await this.findTag(Id)
        
        if (language){
            updatedTag.language=language;
        }
        if (tag){
            updatedTag.tag = tag;
        }
        updatedTag.save();
    }

    async deleteTag(Id: string){
       const result = await this.tagsModel.deleteOne({_id: Id}).exec();
       if (result.deletedCount === 0){
           throw new NotFoundException('Could not find Tag');
       }
    }

    private async findTag(id: string): Promise<TagsDocument> {
        let result;
        try{
            result = await this.tagsModel.findById(id);
        } catch (error){
            throw new NotFoundException('No result');
        }
        if (!result){
            throw new NotFoundException('No result');
        }
        return result;
    }

      
}

