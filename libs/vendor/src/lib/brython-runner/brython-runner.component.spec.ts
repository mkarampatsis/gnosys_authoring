import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrythonRunnerComponent } from './brython-runner.component';

describe('BrythonRunnerComponent', () => {
  let component: BrythonRunnerComponent;
  let fixture: ComponentFixture<BrythonRunnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrythonRunnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrythonRunnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
