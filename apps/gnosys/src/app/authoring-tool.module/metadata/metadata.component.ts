import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

import { Metadata, Script} from '@gnosys/interfaces';
import { MetadataQuery, ScriptQuery } from '../../state/authoring-tool';
import { UserQuery } from '../../state';

import { Actions } from '@datorama/akita-ng-effects';
import { ID } from '@datorama/akita';

import { 
  MetadataCreateAction, 
  MetadataDeleteAction,
  MetadataUpdateAction,
  MetadataSetIDAction,
  ScriptSetIDAction, 
  AlertErrorAction,
} from '../../state';

@Component({
  selector: 'gnosys-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.css']
})
export class MetadataComponent implements OnInit {
  
  public metadatas: Metadata[] | undefined;
  public scripts: Script[] | undefined;
  public activeMetadataID : ID | null | undefined;
  public activeScriptID : ID | null | undefined;
  public activeScript: Script | undefined;
  public scriptName: string | undefined;
  public scriptCode: string[] | undefined;

  countMetadatas = 0;
  countScripts = 0;
  email$ = '';
  isUpdateActivated = false;

  private id : string | undefined;
  private scriptid : string | undefined;
  private scriptname: string | undefined;
  private email : string | undefined;
  private linesofcode : string | undefined;
  private timetosolve : string | undefined;
  private numofif : string | undefined;
  private numoffor : string | undefined;
  private tags : string[] | undefined;

  form = this.fb.group({
    id: [''],
    scriptid: [''],
    scriptname: [''],
    email: ['', [Validators.required, Validators.email]],
    linesofcode: ['', [Validators.required]],
    timetosolve: ['', [Validators.required]],
    numofif: ['', Validators.required],
    numoffor: ['', Validators.required],
    tags: this.fb.array([])
  });
  
  constructor(
    private actions: Actions,
    private metadataQuery: MetadataQuery,
    private scriptQuery: ScriptQuery,
    private userQuery: UserQuery,
    private fb:FormBuilder
  ) { }

  ngOnInit(): void {
    this.userQuery.email$.subscribe(data=>this.email$=data);
    
    this.metadataQuery.allMetadata$.subscribe(data=>this.metadatas=data);
    this.metadataQuery.countMetadata$.subscribe(data=>this.countMetadatas=data);
    this.metadataQuery.activeMetadata$.subscribe(data=> {
      this.id = data?.id;
      this.scriptid = data?.scriptid
      this.scriptname = data?.scriptname
      this.email = data?.email;
      this.linesofcode = data?.linesofcode;
      this.timetosolve = data?.timetosolve;
      this.numofif = data?.numofif;
      this.numoffor = data?.numoffor;
      this.tags = data?.tags;
    })
    this.metadataQuery.activeIDMetadata$.subscribe(data =>this.activeMetadataID=data);
    
    this.scriptQuery.allScripts$.subscribe(data=>this.scripts=data)
    this.scriptQuery.countScripts$.subscribe(data=>this.countScripts=data);
    this.scriptQuery.activeScript$.subscribe(data=> {
      this.scriptName = data?.name;
      this.scriptCode = data?.code;
  })
    this.scriptQuery.activeIDScript$.subscribe(data =>this.activeScriptID=data);

    this.form.controls['scriptid'].setValue(this.activeScriptID || '');
    this.form.controls['scriptname'].setValue(this.scriptName || '');
    this.form.controls['email'].setValue(this.email$);
  }

  onSubmit(){
    // console.log(this.form.value);
    if (this.form.valid) {
      this.actions.dispatch(
        MetadataCreateAction({ data: this.form.value as Metadata })
      );
      this.form.reset();
    } else {
      this.actions.dispatch(
        AlertErrorAction({
          message: 'Invalid Data. Cannot proceed',
        })
      );
    }
  }

  onCancel(){
    this.isUpdateActivated = false;
    this.form.reset();
  }

  onLoad(metadataid:string, scriptid:string){
    this.actions.dispatch(
      ScriptSetIDAction({ setid: scriptid })
    );
    this.actions.dispatch(
      MetadataSetIDAction({ setid: metadataid })
    );
    this.initGroup();
    this.isUpdateActivated = true;
  }

  onSelectChange(){
    const scriptid = this.form.controls['scriptid'].value;
    this.actions.dispatch(
      ScriptSetIDAction({ setid: scriptid || '' })
    );
    this.form.controls['scriptid'].setValue(this.activeScriptID || '');
    this.form.controls['scriptname'].setValue(this.scriptName || '');
  }

  onDelete(metadata: Metadata): void {
    const isConfirmed = confirm(`Delete ${metadata.id}`);
    if (!isConfirmed) {
      return;
    }
    this.actions.dispatch(
      MetadataDeleteAction({ data: metadata.id })
    );
  }

  onUpdate(){
    if (this.form.valid) {
      this.actions.dispatch(
        MetadataUpdateAction({ data: this.form.value as Metadata })
      );
      this.form.reset();
      this.isUpdateActivated=false;
    } else {
      this.actions.dispatch(
        AlertErrorAction({
          message: 'Invalid Data. Cannot proceed',
        })
      );
    }
  }

  private initGroup() {
    
    this.form.controls['id'].setValue(this.id);
    this.form.controls['scriptid'].setValue(this.scriptid);
    this.form.controls['scriptname'].setValue(this.scriptname);
    this.form.controls['email'].setValue(this.email);
    this.form.controls['linesofcode'].setValue(this.linesofcode);
    this.form.controls['timetosolve'].setValue(this.timetosolve);
    this.form.controls['numofif'].setValue(this.numofif);
    this.form.controls['numoffor'].setValue(this.numoffor);

    const frmArray = this.form.get('tags') as FormArray;
    frmArray.clear();
    if (this.tags)
      for (const tag of this.tags){
        this.addTag(tag as unknown as { id: string, name: string } );
      }
  }

  get childTags() {
    return this.form.controls["tags"] as FormArray;
  }

  addTag(data: { id: string, name: string }) {
    const tagForm = this.fb.group({
      id: [data.id, Validators.required],
      name: [data.name, Validators.required]
    });
    this.childTags.push(tagForm);
  }

  deleteTag(tagIndex: number) {
    this.childTags.removeAt(tagIndex);
  }

 
}