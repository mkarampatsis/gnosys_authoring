import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

import { Script } from '@gnosys/interfaces';
import { ScriptQuery } from '../../state/authoring-tool';
import { UserQuery } from '../../state';

import { Actions } from '@datorama/akita-ng-effects';
import { ID } from '@datorama/akita'

import { 
  ScriptCreateAction,
  ScriptUpdateAction,
  ScriptDeleteAction,
  ScriptSetIDAction, 
  AlertErrorAction
} from '../../state';

@Component({
  selector: 'gnosys-code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css']
})
export class CodeEditorComponent implements OnInit {

  public scripts: Script[] | undefined;
  public activeScriptID : ID | null | undefined;
  
  private id : string | undefined;
  private name : string | undefined;
  private description : string | undefined;
  private language : string | undefined;
  private code : string | undefined;
  private email : string | undefined;
  private loading: boolean | undefined;

  countScripts = 0;
  sandScript = '';
  email$ = '';
  isUpdateActivated = false;

  form = new FormGroup({
    id: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    language: new FormControl('', [Validators.required]),
    code: new FormControl('', [Validators.required]),
  });

  constructor(
    private actions: Actions,
    private scriptQuery: ScriptQuery,
    private userQuery: UserQuery,
  ) {}

  ngOnInit() {
    this.userQuery.email$.subscribe(data=>this.email$=data);
    
    this.scriptQuery.allScripts$.subscribe(data=>this.scripts=data)
    this.scriptQuery.countScripts$.subscribe(data=>this.countScripts=data);
    this.scriptQuery.activeScript$.subscribe(data=> {
        this.id = data?.id;
        this.name = data?.name;
        this.description = data?.description;
        this.language = data?.language;
        this.code = data?.code.join("\n");
        this.email = data?.email;
        this.loading = data?.loading;
    })
    this.scriptQuery.activeIDScript$.subscribe(data =>this.activeScriptID=data);

    this.form.controls['email'].setValue(this.email$);
  }

  onSubmit() {
    if (this.form.valid) {
      this.actions.dispatch(
        ScriptCreateAction({ data: this.form.value as Script })
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

  onRun(script: Array<string>) {
    this.sandScript = script.join('\n');
  }
  
  onLoad(id:string){
    this.actions.dispatch(
      ScriptSetIDAction({ setid: id })
    );
    this.initGroup();
    this.isUpdateActivated = true;
  }

  onDelete(script: Script): void {
    const isConfirmed = confirm(`Delete ${script.name}`);
    if (!isConfirmed) {
      return;
    }
    this.actions.dispatch(
      ScriptDeleteAction({ data: script.id })
    );
  }

  onUpdate(){
    if (this.form.valid) {
      this.actions.dispatch(
        ScriptUpdateAction({ data: this.form.value as Script })
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

  initGroup() {
    this.form.setValue({
      id: this.id,
      name: this.name,
      description: this.description,
      language: this.language,
      code: this.code,
      email: this.email,
    })
  }

}
