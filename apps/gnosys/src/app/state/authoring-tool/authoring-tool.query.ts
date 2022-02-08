import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
// import { combineQueries } from '@datorama/akita';

import { HintState, HintStore } from './authoring-tool.store';
import { ScriptState, ScriptStore } from './authoring-tool.store';
import { EduMaterialState, EduMaterialStore } from './authoring-tool.store';
import { MetadataState, MetadataStore } from './authoring-tool.store';
import { TagsState, TagsStore } from './authoring-tool.store';

// ******** Hint ******** //
@Injectable({ providedIn: 'root' })
export class HintQuery extends QueryEntity<HintState> {
  
  selectAreHintsLoaded$ = this.select(state => {
    return state.areHintsLoaded;
  });
  
  constructor(
    protected store: HintStore,
    private scriptQuery: ScriptQuery,
  ) {
    super(store);
  }

  allHints$ =this.selectAll();
  countHints$ = this.selectCount();
  activeHint$ = this.selectActive();
  activeIDHint$ = this.selectActiveId();

  // selectHints() {
  //   return combineQueries(
  //     this.selectAll(), 
  //     this.scriptQuery.selectAll({ asObject: true })
  //   )
    // .pipe(
    //   map(([hints, scripts]) => {
    //     return hints.map(hint => {
    //       return {
    //         ...hint,
    //         // actors: movie.actors.map(actorId => actors[actorId]),
    //         // genres: movie.genres.map(genreId => genres[genreId])
    //       };
    //     });
    //   })
    // );
  // }

}


// ******** Script ******** //
@Injectable({ providedIn: 'root' })
export class ScriptQuery extends QueryEntity<ScriptState> {
  
  selectAreScriptsLoaded$ = this.select(state => {
    return state.areScriptLoaded;
  });
  
  constructor(protected store: ScriptStore) {
    super(store);
  }

  allScripts$ =this.selectAll();
  countScripts$ = this.selectCount();
  activeScript$ = this.selectActive();
  activeIDScript$ = this.selectActiveId();
}

// ******** EduMaterial ******** //
@Injectable({ providedIn: 'root' })
export class EduMaterialQuery extends QueryEntity<EduMaterialState> {
  
  selectAreEduMaterialLoaded$ = this.select(state => {
    return state.areEduMaterialLoaded;
  });
  
  constructor(protected store: EduMaterialStore) {
    super(store);
  }

  allEduMaterial$ =this.selectAll();
  countEduMaterial$ = this.selectCount();
  activeEduMaterial$ = this.selectActive();
  activeIDEduMaterial$ = this.selectActiveId();
}

// ******** Metadata ******** //
@Injectable({ providedIn: 'root' })
export class MetadataQuery extends QueryEntity<MetadataState> {
  
  selectAreMetadataLoaded$ = this.select(state => {
    return state.areMetadataLoaded;
  });
  
  constructor(protected store: MetadataStore) {
    super(store);
  }

  allMetadata$ =this.selectAll();
  countMetadata$ = this.selectCount();
  activeMetadata$ = this.selectActive();
  activeIDMetadata$ = this.selectActiveId();
}

// ******** Tags ******** //
@Injectable({ providedIn: 'root' })
export class TagsQuery extends QueryEntity<TagsState> {
  
  selectAreTagsLoaded$ = this.select(state => {
    return state.areTagsLoaded;
  });
  
  constructor(protected store: TagsStore) {
    super(store);
  }

  allTags$ =this.selectAll();
  countTags$ = this.selectCount();
  activeTags$ = this.selectActive();
  activeIDTags$ = this.selectActiveId();
}