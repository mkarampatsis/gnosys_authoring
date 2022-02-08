import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrythonRunnerComponent } from './brython-runner/brython-runner.component';

@NgModule({
  imports: [CommonModule],
  declarations: [
    BrythonRunnerComponent
  ],
  exports: [
    BrythonRunnerComponent
  ],
})
export class VendorModule {}
