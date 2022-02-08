import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DialogRef } from '@ngneat/dialog';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'dialog-areyousure',
  templateUrl: './dialog-areyousure.component.html',
  styleUrls: ['./dialog-areyousure.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAreyousureComponent {
  context = {
    $implicit: this.ref,
    data: this.ref.data,
  };
  constructor(public ref: DialogRef) {}
}
