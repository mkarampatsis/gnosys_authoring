import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationMaterialComponent } from './education-material.component';

describe('EducationMaterialComponent', () => {
  let component: EducationMaterialComponent;
  let fixture: ComponentFixture<EducationMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EducationMaterialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
