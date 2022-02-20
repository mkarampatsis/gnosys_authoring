import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { InputComponent } from './input/input.component';
import { FormSimpleTopDownComponent } from './form-simple-top-down/form-simple-top-down.component';
import { LoadingComponent } from './loading/loading.component';
import { AlertComponent } from './alert/alert.component';
import { SvgIconComponent } from './svg-icon/svg-icon.component';

import { SvgIconsModule } from '@ngneat/svg-icon';
import { code4CodeIcons } from '../lib/svg/code4code';

// import { EditorComponent } from './editor/editor.component';
// import { DialogAreyousureComponent } from './dialog-areyousure/dialog-areyousure.component';
import { CodemirrorComponent } from './codemirror/codemirror.component';

@NgModule({
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    SvgIconsModule.forChild([...code4CodeIcons]),
  ],
  declarations: [
    InputComponent,
    FormSimpleTopDownComponent,
    LoadingComponent,
    AlertComponent,
    SvgIconComponent,
    // DialogAreyousureComponent,
    // EditorComponent,
    CodemirrorComponent,
  ],
  exports: [
    InputComponent,
    FormSimpleTopDownComponent,
    LoadingComponent,
    AlertComponent,
    SvgIconComponent,
    // DialogAreyousureComponent,
    // EditorComponent,
    CodemirrorComponent,

  ],
})
export class UiModule {}
