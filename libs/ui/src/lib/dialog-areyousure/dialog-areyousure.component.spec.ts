import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAreyousureComponent } from './dialog-areyousure.component';

describe('DialogAreyousureComponent', () => {
  let component: DialogAreyousureComponent;
  let fixture: ComponentFixture<DialogAreyousureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAreyousureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAreyousureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
