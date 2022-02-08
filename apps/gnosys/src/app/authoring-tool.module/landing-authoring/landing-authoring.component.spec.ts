import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingAuthoringComponent } from './landing-authoring.component';

describe('LandingAuthoringComponent', () => {
  let component: LandingAuthoringComponent;
  let fixture: ComponentFixture<LandingAuthoringComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LandingAuthoringComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingAuthoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
