import { Component, OnInit } from '@angular/core';

import { UserQuery } from '../../state';

import { Actions } from '@datorama/akita-ng-effects';

import { 
  HintGetAllAction,
  ScriptGetAllAction,
} from '../../state';

@Component({
  selector: 'gnosys-landing-authoring',
  templateUrl: './landing-authoring.component.html',
  styleUrls: ['./landing-authoring.component.css']
})
export class LandingAuthoringComponent implements OnInit {
  
  title = "Code Editor";
  email$ = '';

  constructor(
    private userQuery: UserQuery,
    private actions: Actions,
  ) {}
  
  ngOnInit(): void {
    this.userQuery.email$.subscribe(data=>this.email$=data);
    this.actions.dispatch(ScriptGetAllAction({email: this.email$}));
    this.actions.dispatch(HintGetAllAction({email: this.email$}));
  }

  showPanel(x:string){
    if (x=='code') {
      this.title = "Code Editor";
    } else if (x=='hint') {
      this.title = "Hint Editor";
    } else if (x=='material') {
      this.title = "Educational Material";
    } else if (x=='metadata') {
      this.title = "Metadata";
    } else if (x=='reports') {
      this.title = "Reports";  
    } else {
      this.title = "Preview";
    }
  }
  
}
