import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig, ActiveState } from '@datorama/akita';

import { Hint } from '@gnosys/interfaces';
import { Script } from '@gnosys/interfaces';
import { EduMaterial } from '@gnosys/interfaces';
import { Metadata } from '@gnosys/interfaces';
import { Tags } from '@gnosys/interfaces';

// ******** Hint ******** //
export interface HintState extends EntityState<Hint, string>, ActiveState {
  areHintsLoaded: boolean;
}

export function createHintInitialState(): HintState {
  return {
    active: '',
    areHintsLoaded: false
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'hints', resettable: true })
export class HintStore extends EntityStore<HintState> {
  constructor() {
    super(createHintInitialState()) ;
  }

  loadHints(hints: Hint[], areHintsLoaded: boolean) {
    this.set(hints);
    this.update(state => ({
      ...state,
      areHintsLoaded
    }));
  }  
}

// ******** Script ******** //
export interface ScriptState extends EntityState<Script, string>, ActiveState {
  areScriptLoaded: boolean;
}

export function createScriptInitialState(): ScriptState {
  return {
    active: '',
    areScriptLoaded: false
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'scripts', resettable: true })
export class ScriptStore extends EntityStore<ScriptState> {
  constructor() {
    super(createScriptInitialState()) ;
  }

  loadScripts(scripts: Script[], areScriptLoaded: boolean) {
    this.set(scripts);
    this.update(state => ({
      ...state,
      areScriptLoaded
    }));
  }  
}

// ******** Educational Material ******** //
export interface EduMaterialState extends EntityState<EduMaterial, string>, ActiveState {
  areEduMaterialLoaded: boolean;
}

export function createEduMaterialInitialState(): EduMaterialState {
  return {
    active: '',
    areEduMaterialLoaded: false
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'edumaterial', resettable: true })
export class EduMaterialStore extends EntityStore<EduMaterialState> {
  constructor() {
    super(createEduMaterialInitialState()) ;
  }

  loadEduMaterials(edumaterials: EduMaterial[], areEduMaterialLoaded: boolean) {
    this.set(edumaterials);
    this.update(state => ({
      ...state,
      areEduMaterialLoaded
    }));
  }  
}

// ******** Metadata ******** //
export interface MetadataState extends EntityState<Metadata, string>, ActiveState {
  areMetadataLoaded: boolean;
}

export function createMetadataInitialState(): MetadataState {
  return {
    active: '',
    areMetadataLoaded: false
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'metadada', resettable: true })
export class MetadataStore extends EntityStore<MetadataState> {
  constructor() {
    super(createMetadataInitialState()) ;
  }

  loadMetadatas(metadata: Metadata[], areMetadataLoaded: boolean) {
    this.set(metadata);
    this.update(state => ({
      ...state,
      areMetadataLoaded
    }));
  }  
}

// ******** Tags ******** //
export interface TagsState extends EntityState<Tags, string>, ActiveState {
  areTagsLoaded: boolean;
}

export function createTagsInitialState(): TagsState {
  return {
    active: '',
    areTagsLoaded: false
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tags', resettable: true })
export class TagsStore extends EntityStore<TagsState> {
  constructor() {
    super(createTagsInitialState()) ;
  }

  loadTags(tags: Tags[], areTagsLoaded: boolean) {
    this.set(tags);
    this.update(state => ({
      ...state,
      areTagsLoaded
    }));
  }  
}