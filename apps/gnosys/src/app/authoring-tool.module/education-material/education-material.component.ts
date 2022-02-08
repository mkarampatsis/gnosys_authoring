import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

import { EduMaterial, Script } from '@gnosys/interfaces';
import { EduMaterialQuery, ScriptQuery } from '../../state/authoring-tool';
import { UserQuery } from '../../state';

import { Actions } from '@datorama/akita-ng-effects';
import { ID } from '@datorama/akita';

import { 
  EduMaterialCreateAction, 
  EduMaterialDeleteAction,
  EduMaterialUpdateAction,
  EduMaterialSetIDAction,
  ScriptSetIDAction, 
  AlertErrorAction,
} from '../../state';

@Component({
  selector: 'gnosys-education-material',
  templateUrl: './education-material.component.html',
  styleUrls: ['./education-material.component.css']
})
export class EducationMaterialComponent implements OnInit {
  
  public edumaterials: EduMaterial[] | undefined;
  public scripts: Script[] | undefined;
  public activeEduMaterialID : ID | null | undefined;
  public activeScriptID : ID | null | undefined;
  public activeScript: Script | undefined;
  public scriptName: string | undefined;
  public scriptCode: string[] | undefined;
  
  countEduMaterials = 0;
  countScripts = 0;
  email$ = '';
  isUpdateActivated = false;

  private id : string | undefined;
  private scriptid : string | undefined;
  private scriptname: string | undefined;
  private email : string | undefined;
  private about : string | undefined;
  private file : string | undefined;
  private video : string | undefined;

  form = new FormGroup({
    id: new FormControl(''),
    scriptid: new FormControl(''),
    scriptname: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    about: new FormControl('', [Validators.required]),
    file: new FormControl('', Validators.required),
    video: new FormControl('', Validators.required),
  });

  constructor(
    private actions: Actions,
    private edumaterialQuery: EduMaterialQuery,
    private scriptQuery: ScriptQuery,
    private userQuery: UserQuery,
  ) { }

  ngOnInit(): void {
    this.userQuery.email$.subscribe(data=>this.email$=data);
    
    this.edumaterialQuery.allEduMaterial$.subscribe(data=>this.edumaterials=data)
    this.edumaterialQuery.countEduMaterial$.subscribe(data=>this.countEduMaterials=data);
    this.edumaterialQuery.activeEduMaterial$.subscribe(data=> {
      this.id = data?.id;
      this.scriptid = data?.scriptid
      this.scriptname = data?.scriptname
      this.email = data?.email;
      this.about = data?.about;
      this.file = data?.file;
      this.video = data?.video;
    })
    this.edumaterialQuery.activeIDEduMaterial$.subscribe(data =>this.activeEduMaterialID=data);
    
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
    if (this.form.valid) {
      this.actions.dispatch(
        EduMaterialCreateAction({ data: this.form.value as EduMaterial })
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

  onLoad(edumaterialid:string, scriptid:string){
    this.actions.dispatch(
      ScriptSetIDAction({ setid: scriptid })
    );
    this.actions.dispatch(
      EduMaterialSetIDAction({ setid: edumaterialid })
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

  onDelete(edumaterial: EduMaterial): void {
    const isConfirmed = confirm(`Delete ${edumaterial.id}`);
    if (!isConfirmed) {
      return;
    }
    this.actions.dispatch(
      EduMaterialDeleteAction({ data: edumaterial.id })
    );
  }

  onUpdate(){
    if (this.form.valid) {
      this.actions.dispatch(
        EduMaterialUpdateAction({ data: this.form.value as EduMaterial })
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
      about: this.about,
      file: this.file,
      video: this.video,      
    })
  }
 
}
