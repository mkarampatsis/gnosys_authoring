import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LandingAuthoringComponent } from './landing-authoring/landing-authoring.component';
import { CodeEditorComponent } from './code-editor/code-editor.component';
import { HintEditorComponent } from './hint-editor/hint-editor.component';
import { EducationMaterialComponent } from './education-material/education-material.component';
import { MetadataComponent } from './metadata/metadata.component';
import { UiModule } from '@gnosys/ui';
import { VendorModule } from '@nocode/vendor';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { code4CodeIcons } from '@gnosys/ui';
import { PreviewComponent } from './preview/preview.component';
import { ReportsComponent } from './reports/reports.component';
import { TagsComponent } from './tags/tags.component';

export const userRoutes: Route[] = [
  { path: '', component: LandingAuthoringComponent },
  //{ path: 'hint', component: HintEditorComponent },
];

@NgModule({
  declarations: [
    LandingAuthoringComponent,
    CodeEditorComponent,
    HintEditorComponent,
    EducationMaterialComponent,
    MetadataComponent,
    PreviewComponent,
    ReportsComponent,
    TagsComponent
  ],
  imports: [
    CommonModule, 
    RouterModule.forChild(userRoutes),
    UiModule,
    VendorModule,
    FormsModule,
    ReactiveFormsModule,
    SvgIconsModule.forChild([...code4CodeIcons]),
  ]
})
export class AuthoringToolModule { }
