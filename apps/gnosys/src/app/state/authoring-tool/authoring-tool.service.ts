import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { 
  Hint, 
  Script,
  EduMaterial,
  Metadata,
  Tags
} from '@gnosys/interfaces';

import { 
  HintStore, 
  ScriptStore,
  EduMaterialStore,
  MetadataStore,
  TagsStore
} from './authoring-tool.store';

const AUTH_API = '/api/authoring/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({ providedIn: 'root' })
export class AuthoringToolService {

  http: HttpClient;

  storeHint: HintStore;
  storeScript: ScriptStore;
  storeEduMaterial: EduMaterialStore;
  storeMetadata: MetadataStore;
  storeTags: TagsStore;

  constructor(
    http: HttpClient,
    storeHint: HintStore,
    storeScript: ScriptStore,
    storeEduMaterial: EduMaterialStore,
    storeMetadata: MetadataStore,
    storeTags: TagsStore,
  ) {
    this.http = http;
    this.storeHint = storeHint;
    this.storeScript = storeScript;
    this.storeEduMaterial = storeEduMaterial;
    this.storeMetadata = storeMetadata;
    this.storeTags = storeTags;
  }
  
  // ******** Hints ******** //
  setloadingHints(isloading: boolean) {
    this.storeHint.update({ loading: isloading });
  }
  
  getHints(data: string): Observable<Hint[]> {
    return this.http.get<Hint[]>( `${AUTH_API}hint/${data}`, httpOptions).pipe(
      tap(data => {
        this.storeHint.loadHints(data, true);
      })
    );
  }

  createHint(data: Hint): Observable<Hint> {
    return this.http.post<Hint>(`${AUTH_API}hint`, data, httpOptions).pipe(
      tap(data => {
        this.storeHint.add(data);
      })
    );
  }

  deleteHint(data: string) {
    return this.http.delete(`${AUTH_API}hint/${data}`).pipe(
      tap(() => {
        this.storeHint.remove(data);
      })
    );
  }

  updateInitHint(hintFormData: Partial<Hint>) {
    this.storeHint.update({ ...hintFormData });
  }
  
  updateHint(hintid: string, hint: Hint) {
    console.log(">>",hint);
    return this.http.patch(`${AUTH_API}hint/${hintid}`, hint).pipe(
      tap(() => {
        this.storeHint.update(hintid, hint);
      })
    )
  }

  setHintActiveID(id:string){
    this.storeHint.setActive(id);
  }

// ******** Script ******** //
  setloadingScripts(isloading: boolean) {
    this.storeScript.update({ loading: isloading });
  }

  getScripts(data: string): Observable<Script[]> {
    return this.http.get<Script[]>( `${AUTH_API}script/${data}`)
    .pipe(
      tap(data => {
        this.storeScript.loadScripts(data, true);
      })
    );
  }

  createScript(data: Script): Observable<Script> {
    return this.http.post<Script>(`${AUTH_API}script`, data, httpOptions).pipe(
      tap(data => {
        this.storeScript.add(data);
      })
    );
  }

  deleteScript(data: string) {
    return this.http.delete(`${AUTH_API}script/${data}`).pipe(
      tap(() => {
        this.storeScript.remove(data);
      })
    );
  }

  updateInitScript(scriptFormData: Partial<Script>) {
    this.storeScript.update({ ...scriptFormData });
  }

  updateScript(scriptid: string, script: Script) {
    return this.http.patch(`${AUTH_API}script/${scriptid}`, script).pipe(
      tap(() => {
        this.storeScript.update(scriptid, script);
      })
    )
  }

  setScriptActiveID(id:string){
    this.storeScript.setActive(id);
  }

  // ******** EduMaterial ******** //
  setloadingEduMaterials(isloading: boolean) {
    this.storeEduMaterial.update({ loading: isloading });
  }
  
  getEduMaterials(data: string): Observable<EduMaterial[]> {
    return this.http.get<EduMaterial[]>( `${AUTH_API}edumaterial/${data}`, httpOptions).pipe(
      tap(data => {
        this.storeEduMaterial.loadEduMaterials(data, true);
      })
    );
  }

  createEduMaterial(data: EduMaterial): Observable<EduMaterial> {
    return this.http.post<EduMaterial>(`${AUTH_API}edumaterial`, data, httpOptions).pipe(
      tap(data => {
        this.storeEduMaterial.add(data);
      })
    );
  }

  deleteEduMaterial(data: string) {
    return this.http.delete(`${AUTH_API}edumaterial/${data}`).pipe(
      tap(() => {
        this.storeEduMaterial.remove(data);
      })
    );
  }

  updateInitEduMaterial(eduMaterialFormData: Partial<EduMaterial>) {
    this.storeEduMaterial.update({ ...eduMaterialFormData });
  }
  
  updateEduMaterial(id: string, edumaterial: EduMaterial) {
    console.log(">>",edumaterial);
    return this.http.patch(`${AUTH_API}edumaterial/${id}`, edumaterial).pipe(
      tap(() => {
        this.storeEduMaterial.update(id, edumaterial);
      })
    )
  }

  setEduMaterialActiveID(id:string){
    this.storeEduMaterial.setActive(id);
  }

  // ******** Metadata ******** //
  setloadingMetadatas(isloading: boolean) {
    this.storeMetadata.update({ loading: isloading });
  }
  
  getMetadatas(data: string): Observable<Metadata[]> {
    return this.http.get<Metadata[]>( `${AUTH_API}metadata/${data}`, httpOptions).pipe(
      tap(data => {
        this.storeMetadata.loadMetadatas(data, true);
      })
    );
  }

  createMetadata(data: Metadata): Observable<Metadata> {
    return this.http.post<Metadata>(`${AUTH_API}metadata`, data, httpOptions).pipe(
      tap(data => {
        this.storeMetadata.add(data);
      })
    );
  }

  deleteMetadata(data: string) {
    return this.http.delete(`${AUTH_API}metadata/${data}`).pipe(
      tap(() => {
        this.storeMetadata.remove(data);
      })
    );
  }

  updateInitMetadata(metadataFormData: Partial<Metadata>) {
    this.storeMetadata.update({ ...metadataFormData });
  }
  
  updateMetadata(id: string, metadata: Metadata) {
    console.log(">>",metadata);
    return this.http.patch(`${AUTH_API}metadata/${id}`, metadata).pipe(
      tap(() => {
        this.storeMetadata.update(id, metadata);
      })
    )
  }

  setMetadataActiveID(id:string){
    this.storeMetadata.setActive(id);
  }

  // ******** Tags ******** //
  setloadingTags(isloading: boolean) {
    this.storeTags.update({ loading: isloading });
  }
  
  getTags(data: string): Observable<Tags[]> {
    return this.http.get<Tags[]>( `${AUTH_API}tags/${data}`, httpOptions).pipe(
      tap(data => {
        this.storeTags.loadTags(data, true);
      })
    );
  }

  createTag(data: Tags): Observable<Tags> {
    return this.http.post<Tags>(`${AUTH_API}tags`, data, httpOptions).pipe(
      tap(data => {
        this.storeTags.add(data);
      })
    );
  }

  deleteTag(data: string) {
    return this.http.delete(`${AUTH_API}tags/${data}`).pipe(
      tap(() => {
        this.storeTags.remove(data);
      })
    );
  }

  updateInitTags(tagsFormData: Partial<Tags>) {
    this.storeTags.update({ ...tagsFormData });
  }
  
  updateTag(id: string, tags: Tags) {
    console.log(">>",tags);
    return this.http.patch(`${AUTH_API}tags/${id}`, tags).pipe(
      tap(() => {
        this.storeTags.update(id, tags);
      })
    )
  }

  setTagsActiveID(id:string){
    this.storeTags.setActive(id);
  }

 

}