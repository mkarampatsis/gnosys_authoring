import { Controller, Get, Post, Body, Param, Patch, Delete, HttpCode, HttpStatus } from '@nestjs/common';
// import { controlEnabledWhile } from '@ngneat/reactive-forms/lib/core';
import { AuthoringService } from "./authoring.service";
import { CreateHintDto } from './dto/hint.dto';
import { CreateScriptDto } from './dto/script.dto';
import { CreateEduMaterialDto } from './dto/edumaterial.dto';
import { CreateMetadataDto } from './dto/metadata.dto';
import { CreateTagsDto } from './dto/tags.dto';

@Controller('authoring')
export class AuthoringController {
    constructor(private readonly authoringService: AuthoringService){}
    
    // Scripts
    @Post('script')
    @HttpCode(HttpStatus.CREATED)
    async createScript(@Body() createScriptDto: CreateScriptDto) {
        return await this.authoringService.createScript(createScriptDto);
    }

    @Patch('script/:id')
    async updateScript(
        @Param('id') Id: string,
        @Body('email') Email: string,
        @Body('name') Name: string,
        @Body('description') Desc: string,
        @Body('code') Code: string[], 
        @Body('language') Lang: string,
    ){   
        await this.authoringService.updateScript( Id, Email, Name, Desc, Code, Lang );
        return null;
    }

    @Delete('script/:id')
    async removeScript(@Param('id') Id: string,){
        await this.authoringService.deleteScript(Id);
        return null;
    }

    @Get('script/:email')
    async getScripts(@Param('email') email: string,) {
        const result = await this.authoringService.getScripts(email);
        return result;
    }

    // Hints
    @Post('hint')
    @HttpCode(HttpStatus.CREATED)
    async createHint(@Body() createHintDto: CreateHintDto) {
        return await this.authoringService.createHint(createHintDto);
    }

    @Get('hint/:email')
    async getHints(@Param('email') email: string,) {
        const result = await this.authoringService.getHints(email);
        return result;
    }

    @Get('hint/:id')
    getHint(@Param('id') Id: string,) {
        return this.authoringService.getHint(Id);
    }

    @Patch('hint/:id')
    async updateHint(
        @Param('id') Id: string,
        @Body('scriptid') ScriptID: string,
        @Body('scriptname') ScriptName: string,
        @Body('title') Title: string,
        @Body('description') Desc: string,
        @Body('code') Code: string, 
    ){
        await this.authoringService.updateHint(Id, ScriptID, ScriptName, Title, Desc, Code);
        return null;
    }

    @Delete('hint/:id')
    async removeHint(@Param('id') hintId: string,){
        await this.authoringService.deleteHint(hintId);
        return null;
    }

    // EduMaterial
    @Post('edumaterial')
    @HttpCode(HttpStatus.CREATED)
    async createEduMaterial(@Body() createEduMaterialDto: CreateEduMaterialDto) {
        return await this.authoringService.createEduMaterial(createEduMaterialDto);
    }

    @Get('edumaterial/:email')
    async getEduMaterials(@Param('email') email: string,) {
        const result = await this.authoringService.getEduMaterials(email);
        return result;
    }

    @Get('edumaterial/:id')
    getEduMaterial(@Param('id') Id: string,) {
        return this.authoringService.getEduMaterial(Id);
    }

    @Patch('edumaterial/:id')
    async updateEduMaterial(
        @Param('id') Id: string,
        @Body('scriptid') ScriptID: string,
        @Body('scriptname') ScriptName: string,
        @Body('about') About: string,
        @Body('file') File: string,
        @Body('video') Video: string, 
    ){
        await this.authoringService.updateEduMaterial(Id, ScriptID, ScriptName, About, File, Video);
        return null;
    }

    @Delete('edumaterial/:id')
    async removeEduMaterial(@Param('id') Id: string,){
        await this.authoringService.deleteEduMaterial(Id);
        return null;
    }

    // Metadata
    @Post('metadata')
    @HttpCode(HttpStatus.CREATED)
    async createMetadata(@Body() createMetadataDto: CreateMetadataDto) {
        return await this.authoringService.createMetadata(createMetadataDto);
    }

    @Get('metadata/:email')
    async getMetadatas(@Param('email') email: string,) {
        const result = await this.authoringService.getMetadatas(email);
        return result;
    }

    @Get('metadata/:id')
    getMetadata(@Param('id') Id: string,) {
        return this.authoringService.getMetadata(Id);
    }

    @Patch('metadata/:id')
    async updateMetadata(
        @Param('id') Id: string,
        @Body('scriptid') ScriptID: string,
        @Body('scriptname') ScriptName: string,
        @Body('linesofcode') Linesofcode: string,
        @Body('timetosolve') Timetosolve: string,
        @Body('numofif') Numofif: string, 
        @Body('numoffor') Numoffor: string, 
        @Body('tags') Tags: { id: string; name: string; }[]
    ){
        await this.authoringService.updateMetadata(Id, ScriptID, ScriptName, Linesofcode, Timetosolve, Numofif, Numoffor, Tags);
        return null;
    }

    @Delete('metadata/:id')
    async removeMetadata(@Param('id') Id: string,){
        await this.authoringService.deleteMetadata(Id);
        return null;
    }

    // Tags
    @Post('tags')
    @HttpCode(HttpStatus.CREATED)
    async createTag(@Body() createTagsDto: CreateTagsDto) {
        return await this.authoringService.createTag(createTagsDto);
    }

    @Get('tags/:email')
    async getTags(@Param('email') email: string,) {
        const result = await this.authoringService.getTags(email);
        return result;
    }

    @Get('tags/:id')
    getTag(@Param('id') Id: string,) {
        return this.authoringService.getTag(Id);
    }

    @Patch('tags/:id')
    async updateTag(
        @Param('id') Id: string,
        @Body('language') Language: string,
        @Body('tag') Tag: string,
    ){
        await this.authoringService.updateTag(Id, Language, Tag);
        return null;
    }

    @Delete('tags/:id')
    async removeTag(@Param('id') Id: string,){
        await this.authoringService.deleteTag(Id);
        return null;
    }
}

