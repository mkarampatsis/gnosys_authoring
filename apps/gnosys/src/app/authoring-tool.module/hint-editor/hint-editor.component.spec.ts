import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HintEditorComponent } from './hint-editor.component';

describe('HintEditorComponent', () => {
  let component: HintEditorComponent;
  let fixture: ComponentFixture<HintEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HintEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HintEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
