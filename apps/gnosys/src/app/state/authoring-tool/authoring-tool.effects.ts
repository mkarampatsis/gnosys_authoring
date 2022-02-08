import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Actions as AkitaActions,
  createEffect,
  ofType,
} from '@datorama/akita-ng-effects';
import { map, take, tap } from 'rxjs/operators';
import * as Actions from './authoring-tool.actions';

import { 
  initHintFormData,
  initScriptFormData ,
  initEduMaterialFormData,
  initMetadataFormData,
  initTagsFormData
} from './authoring-tool.model';
import { AuthoringToolService } from './authoring-tool.service';
import { 
  AlertSuccessAction,
  HintSetIDAction,
  ScriptSetIDAction,
  EduMaterialSetIDAction,
  MetadataSetIDAction,
  TagsSetIDAction
 } from '..';

@Injectable({ providedIn: 'root' })
export class GnosysAuthoringToolEffects {

  constructor(
    private actions: AkitaActions,
    private router: Router,
    private authoringtoolService: AuthoringToolService,
 ) {}
  
// ******** Hint ******** // 
  InitHintEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.HintInitAction),
      tap(() => this.authoringtoolService.updateInitHint(initHintFormData))
    )
  );

  HintIsLoadingEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.HintIsLoadingAction),
      tap((payload) => this.authoringtoolService.setloadingHints(payload.isloading))
    )
  );

  HintCreateEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.HintCreateAction),
      map((payload) => payload.data),
      tap((data) => {
        this.authoringtoolService
          .createHint(data)
          .pipe(take(1))
          .subscribe((hint) => {
            this.actions.dispatch(
              AlertSuccessAction({
                header: `${hint.title}`,
                message: `Hint ${hint.title} is saved.`,
              })
            );
            this.actions.dispatch(
              HintSetIDAction({ setid: hint.id })
            );
            this.router.navigate(['/authoring']);
          })
        })
     )
  );
  
  HintGetAllEffect = createEffect(() => 
    this.actions.pipe(
      ofType(Actions.HintGetAllAction),
      map((payload) => payload.email),
      tap((email) => {
        this.authoringtoolService.getHints(email)
        .pipe(take(1))
        .subscribe()
      })
    )
  );

   HintUpdateEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.HintUpdateAction),
      map((payload) => payload.data),
      tap((data) => {
         this.authoringtoolService.updateHint(data.id, data)
        .pipe(take(1))
        .subscribe(()=>{
          this.actions.dispatch(
            AlertSuccessAction({
              header: `Update`,
              message: `Hint is Updated.`,
            })
          );
          this.router.navigate(['../authoring']);
        })
      })
    )
  );

  HintDeleteEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.HintDeleteAction),
      map((payload) => payload.data),
      tap((data) => {
        this.authoringtoolService
          .deleteHint(data)
          .pipe(take(1))
          .subscribe(() => {
            this.actions.dispatch(
              AlertSuccessAction({
                header: `Delete`,
                message: `Hint is deleted.`,
              })
            );
            this.router.navigate(['../authoring']);
          })
        })
     )
  );

  HintSetIDEffect = createEffect(() => 
    this.actions.pipe(
      ofType(Actions.HintSetIDAction),
      tap((data) => {
        this.authoringtoolService.setHintActiveID(data.setid)
      })
    )
  );

// ******** Script ******** //
  InitScriptEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.ScriptInitAction),
      tap(() => this.authoringtoolService.updateInitScript(initScriptFormData))
    )
  );

  ScriptIsLoadingEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.ScriptIsLoadingAction),
      tap((payload) => this.authoringtoolService.setloadingScripts(payload.isloading))
    )
  );

  ScriptCreateEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.ScriptCreateAction),
      map((payload) => payload.data),
      tap((data) => {
        this.authoringtoolService
          .createScript(data)
          .pipe(take(1))
          .subscribe((script) => {
            this.actions.dispatch(
              AlertSuccessAction({
                header: `${script.name}`,
                message: `Script ${script.name} is saved.`,
              })
            );
            this.actions.dispatch(
              ScriptSetIDAction({ setid: script.id })
            );
            this.router.navigate(['/authoring']);
          })
        })
     )
  );

  ScriptUpdateEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.ScriptUpdateAction),
      map((payload) => payload.data),
      tap((data) => {
         this.authoringtoolService.updateScript(data.id, data)
        .pipe(take(1))
        .subscribe(()=>{
          this.actions.dispatch(
            AlertSuccessAction({
              header: `Update`,
              message: `Script is Updated.`,
            })
          );
          this.router.navigate(['../authoring']);
        })
      })
    )
  );

  ScriptDeleteEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.ScriptDeleteAction),
      map((payload) => payload.data),
      tap((data) => {
        this.authoringtoolService
          .deleteScript(data)
          .pipe(take(1))
          .subscribe(() => {
            this.actions.dispatch(
              AlertSuccessAction({
                header: `Delete`,
                message: `Script is deleted.`,
              })
            );
            this.router.navigate(['../authoring']);
          })
        })
     )
  );

  ScriptGetAllEffect = createEffect(() => 
    this.actions.pipe(
      ofType(Actions.ScriptGetAllAction),
      map((payload) => payload.email),
      tap((email) => {
        this.authoringtoolService.getScripts(email)
        .pipe(take(1))
        .subscribe()
      })
    )
  );

  ScriptSetIDEffect = createEffect(() => 
    this.actions.pipe(
      ofType(Actions.ScriptSetIDAction),
      tap((data) => {
        this.authoringtoolService.setScriptActiveID(data.setid)
      })
    )
  );
  
  // ******** EduMaterial ******** // 
  InitEduMaterialEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.EduMaterialInitAction),
      tap(() => this.authoringtoolService.updateInitEduMaterial(initEduMaterialFormData))
    )
  );

  EduMaterialIsLoadingEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.EduMaterialIsLoadingAction),
      tap((payload) => this.authoringtoolService.setloadingEduMaterials(payload.isloading))
    )
  );

  EduMaterialCreateEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.EduMaterialCreateAction),
      map((payload) => payload.data),
      tap((data) => {
        this.authoringtoolService
          .createEduMaterial(data)
          .pipe(take(1))
          .subscribe((data) => {
            this.actions.dispatch(
              AlertSuccessAction({
                header: `${data.id}`,
                message: `Educational Material ${data.id} is saved.`,
              })
            );
            this.actions.dispatch(
              EduMaterialSetIDAction({ setid: data.id })
            );
            this.router.navigate(['/authoring']);
          })
        })
     )
  );
  
  EduMaterialGetAllEffect = createEffect(() => 
    this.actions.pipe(
      ofType(Actions.EduMaterialGetAllAction),
      map((payload) => payload.email),
      tap((email) => {
        this.authoringtoolService.getEduMaterials(email)
        .pipe(take(1))
        .subscribe()
      })
    )
  );

  EduMaterialUpdateEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.EduMaterialUpdateAction),
      map((payload) => payload.data),
      tap((data) => {
         this.authoringtoolService.updateEduMaterial(data.id, data)
        .pipe(take(1))
        .subscribe(()=>{
          this.actions.dispatch(
            AlertSuccessAction({
              header: `Update`,
              message: `Educational Material is Updated.`,
            })
          );
          this.router.navigate(['../authoring']);
        })
      })
    )
  );

  EduMaterialDeleteEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.EduMaterialDeleteAction),
      map((payload) => payload.data),
      tap((data) => {
        this.authoringtoolService
          .deleteEduMaterial(data)
          .pipe(take(1))
          .subscribe(() => {
            this.actions.dispatch(
              AlertSuccessAction({
                header: `Delete`,
                message: `Educational Material is deleted.`,
              })
            );
            this.router.navigate(['../authoring']);
          })
        })
     )
  );

  EduMaterialSetIDEffect = createEffect(() => 
    this.actions.pipe(
      ofType(Actions.EduMaterialSetIDAction),
      tap((data) => {
        this.authoringtoolService.setEduMaterialActiveID(data.setid)
      })
    )
  );

  // ******** Metadata ******** // 
  InitMetadataEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.MetadataInitAction),
      tap(() => this.authoringtoolService.updateInitMetadata(initMetadataFormData))
    )
  );

  MetadataIsLoadingEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.MetadataIsLoadingAction),
      tap((payload) => this.authoringtoolService.setloadingMetadatas(payload.isloading))
    )
  );

  MetadataCreateEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.MetadataCreateAction),
      map((payload) => payload.data),
      tap((data) => {
        this.authoringtoolService
          .createMetadata(data)
          .pipe(take(1))
          .subscribe((data) => {
            this.actions.dispatch(
              AlertSuccessAction({
                header: `${data.id}`,
                message: `Metadata ${data.id} is saved.`,
              })
            );
            this.actions.dispatch(
              MetadataSetIDAction({ setid: data.id })
            );
            this.router.navigate(['/authoring']);
          })
        })
     )
  );
  
  MetadataGetAllEffect = createEffect(() => 
    this.actions.pipe(
      ofType(Actions.MetadataGetAllAction),
      map((payload) => payload.email),
      tap((email) => {
        this.authoringtoolService.getMetadatas(email)
        .pipe(take(1))
        .subscribe()
      })
    )
  );

  MetadataUpdateEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.MetadataUpdateAction),
      map((payload) => payload.data),
      tap((data) => {
         this.authoringtoolService.updateMetadata(data.id, data)
        .pipe(take(1))
        .subscribe(()=>{
          this.actions.dispatch(
            AlertSuccessAction({
              header: `Update`,
              message: `Metadata is Updated.`,
            })
          );
          this.router.navigate(['../authoring']);
        })
      })
    )
  );

  MetadataDeleteEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.MetadataDeleteAction),
      map((payload) => payload.data),
      tap((data) => {
        this.authoringtoolService
          .deleteMetadata(data)
          .pipe(take(1))
          .subscribe(() => {
            this.actions.dispatch(
              AlertSuccessAction({
                header: `Delete`,
                message: `Metadata is deleted.`,
              })
            );
            this.router.navigate(['../authoring']);
          })
        })
     )
  );

  MetadataSetIDEffect = createEffect(() => 
    this.actions.pipe(
      ofType(Actions.MetadataSetIDAction),
      tap((data) => {
        this.authoringtoolService.setMetadataActiveID(data.setid)
      })
    )
  );
  
  // ******** Tags ******** // 
  InitTagsEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.TagsInitAction),
      tap(() => this.authoringtoolService.updateInitTags(initTagsFormData))
    )
  );

  TagsIsLoadingEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.TagsIsLoadingAction),
      tap((payload) => this.authoringtoolService.setloadingTags(payload.isloading))
    )
  );

  TagsCreateEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.TagsCreateAction),
      map((payload) => payload.data),
      tap((data) => {
        this.authoringtoolService
          .createTag(data)
          .pipe(take(1))
          .subscribe((data) => {
            this.actions.dispatch(
              AlertSuccessAction({
                header: `${data.id}`,
                message: `Tag ${data.tag} is saved.`,
              })
            );
            this.actions.dispatch(
              TagsSetIDAction({ setid: data.id })
            );
            this.router.navigate(['/authoring']);
          })
        })
     )
  );
  
  TagsGetAllEffect = createEffect(() => 
    this.actions.pipe(
      ofType(Actions.TagsGetAllAction),
      map((payload) => payload.email),
      tap((email) => {
        this.authoringtoolService.getTags(email)
        .pipe(take(1))
        .subscribe()
      })
    )
  );

  TagsUpdateEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.TagsUpdateAction),
      map((payload) => payload.data),
      tap((data) => {
         this.authoringtoolService.updateTag(data.id, data)
        .pipe(take(1))
        .subscribe(()=>{
          this.actions.dispatch(
            AlertSuccessAction({
              header: `Update`,
              message: `Tag is Updated.`,
            })
          );
          this.router.navigate(['../authoring']);
        })
      })
    )
  );

  TagsDeleteEffect = createEffect(() =>
    this.actions.pipe(
      ofType(Actions.TagsDeleteAction),
      map((payload) => payload.data),
      tap((data) => {
        this.authoringtoolService
          .deleteTag(data)
          .pipe(take(1))
          .subscribe(() => {
            this.actions.dispatch(
              AlertSuccessAction({
                header: `Delete`,
                message: `Tag is deleted.`,
              })
            );
            this.router.navigate(['../authoring']);
          })
        })
     )
  );

  TagsSetIDEffect = createEffect(() => 
    this.actions.pipe(
      ofType(Actions.TagsSetIDAction),
      tap((data) => {
        this.authoringtoolService.setTagsActiveID(data.setid)
      })
    )
  );

}