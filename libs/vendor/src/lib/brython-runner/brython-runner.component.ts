import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
} from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'brython-runner',
  templateUrl: './brython-runner.component.html',
  styleUrls: ['./brython-runner.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrythonRunnerComponent implements AfterViewInit {
  @ViewChild('brython_runner') iframeElmRef: ElementRef | undefined;
  iframe: HTMLIFrameElement | undefined;
  iwindow: Window | null | undefined;
  @Input() set script(value: string) {
    this.iwindow?.postMessage(value, this.iwindow.location.href);
  }

  ngAfterViewInit(): void {
    if (this.iframeElmRef) {
      this.iframe = this.iframeElmRef.nativeElement;
      this.iwindow = (this.iframe as HTMLIFrameElement).contentWindow;
    }
  }
}
