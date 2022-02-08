import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';

import { Tags } from '@gnosys/interfaces';
import { TagsQuery } from '../../state/authoring-tool';
import { UserQuery } from '../../state';

import { Actions } from '@datorama/akita-ng-effects';

import { 
  TagsCreateAction, 
  TagsDeleteAction,
  TagsUpdateAction,
  TagsSetIDAction,
  AlertErrorAction,
} from '../../state';

@Component({
  selector: 'gnosys-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css']
})
export class TagsComponent implements OnInit {

  @Output() callAddTagFunction: EventEmitter<{ id: string, name: string }> = new EventEmitter<{ id: string, name: string }>();

  public tags: Tags[] | undefined;

  public modalStatus: boolean;

  //tagArray: Array<{ id: string, name: string }> = [];

  email$ = '';

  form = new FormGroup({
    id: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    language: new FormControl('', Validators.required),
    tag: new FormControl('', Validators.required),
  });

  constructor(
    private actions: Actions,
    private userQuery: UserQuery,
    private tagQuery: TagsQuery,
  ) {
    this.modalStatus = false;
  }

  ngOnInit(): void {
    this.userQuery.email$.subscribe(data=>this.email$=data);
    this.tagQuery.allTags$.subscribe(data=>this.tags=data);

    this.form.controls['email'].setValue(this.email$);
  }

  onSubmit(){
    this.form.controls['email'].setValue(this.email$);
    if (this.form.valid) {
      this.actions.dispatch(
        TagsCreateAction({ data: this.form.value as Tags })
      );
      this.form.reset();
    } else {
      this.actions.dispatch(
        AlertErrorAction({
          message: 'Invalid Data. Cannot proceed',
        })
      );
    }
    this.modalStatus = false;
  }

  onClose(){
    this.form.reset();
    this.modalStatus = false;
  }

  onLoadTag(id: string, name: string){
    this.callAddTagFunction.emit({id: id, name: name});
  }

  onDeleteTag(tag: Tags): void {
    const isConfirmed = confirm(`Delete ${tag.id}`);
    if (!isConfirmed) {
      return;
    }
    this.actions.dispatch(
      TagsDeleteAction({ data: tag.id })
    );
  }

  toggleModal(){
    this.modalStatus = true;
  }

}
