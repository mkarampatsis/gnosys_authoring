import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

import { Hint, Script } from '@gnosys/interfaces';
import { HintQuery, ScriptQuery } from '../../state/authoring-tool';
import { UserQuery } from '../../state';

import { Actions } from '@datorama/akita-ng-effects';
import { ID } from '@datorama/akita'

import { 
  HintCreateAction, 
  HintDeleteAction,
  HintUpdateAction,
  HintSetIDAction,
  ScriptSetIDAction, 
  AlertErrorAction,
} from '../../state';

@Component({
  selector: 'gnosys-hint-editor',
  templateUrl: './hint-editor.component.html',
  styleUrls: ['./hint-editor.component.css']
})
export class HintEditorComponent implements OnInit {

  public hints: Hint[] | undefined;
  public scripts: Script[] | undefined;
  public activeHintID : ID | null | undefined;
  public activeScriptID : ID | null | undefined;
  public activeScript: Script | undefined;
  public scriptName: string | undefined;
  public scriptCode: string[] | undefined;
  
  countHints = 0;
  countScripts = 0;
  email$ = '';
  isUpdateActivated = false;

  private id : string | undefined;
  private scriptid : string | undefined;
  private scriptname: string | undefined;
  private email : string | undefined;
  private title : string | undefined;
  private description : string | undefined;
  private code : string | undefined;

  form = new FormGroup({
    id: new FormControl(''),
    scriptid: new FormControl(''),
    scriptname: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', Validators.required),
    code: new FormControl('', Validators.required),
  });

  constructor(
    private actions: Actions,
    private hintQuery: HintQuery,
    private scriptQuery: ScriptQuery,
    private userQuery: UserQuery,
  ) {}

  ngOnInit(): void {
    this.userQuery.email$.subscribe(data=>this.email$=data);
    
    this.hintQuery.allHints$.subscribe(data=>this.hints=data)
    this.hintQuery.countHints$.subscribe(data=>this.countHints=data);
    this.hintQuery.activeHint$.subscribe(data=> {
      this.id = data?.id;
      this.scriptid = data?.scriptid
      this.scriptname = data?.scriptname
      this.email = data?.email;
      this.title = data?.title;
      this.description = data?.description;
      this.code = data?.code;
    })
    this.hintQuery.activeIDHint$.subscribe(data =>this.activeHintID=data);
    
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

  onSubmit() {
    if (this.form.valid) {
        this.actions.dispatch(
        HintCreateAction({ data: this.form.value as Hint })
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

  onLoad(hintid:string, scriptid:string){
    this.actions.dispatch(
      ScriptSetIDAction({ setid: scriptid })
    );
    this.actions.dispatch(
      HintSetIDAction({ setid: hintid })
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

  onDelete(hint: Hint): void {
    const isConfirmed = confirm(`Delete ${hint.title}`);
    if (!isConfirmed) {
      return;
    }
    this.actions.dispatch(
      HintDeleteAction({ data: hint.id })
    );
  }
  
  onUpdate(){
    if (this.form.valid) {
      this.actions.dispatch(
        HintUpdateAction({ data: this.form.value as Hint })
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
    this.form.setValue({
      id: this.id,
      scriptid: this.scriptid,
      scriptname: this.scriptname,
      email: this.email,
      title: this.title,
      description: this.description,
      code: this.code,      
    })
  }

}
