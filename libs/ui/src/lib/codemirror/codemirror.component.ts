import { FocusMonitor, FocusOrigin } from '@angular/cdk/a11y';
import { coerceBooleanProperty } from '@angular/cdk/coercion';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild,
  Optional,
  Self,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { basicSetup, EditorState } from '@codemirror/basic-setup';
import { Compartment, Extension, Text, Transaction } from '@codemirror/state';
import { EditorView, ViewUpdate } from '@codemirror/view';
import { python } from '@codemirror/lang-python';
import { Subject } from 'rxjs';

export type EditorStateConfig = Parameters<typeof EditorState.create>[0];

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'codemirror',
  templateUrl: './codemirror.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodemirrorComponent
  implements ControlValueAccessor, AfterViewInit, OnDestroy
{
  @ViewChild('codemirrorhost', { static: false }) codemirrorHost?: ElementRef;

  stateChanges: Subject<void> = new Subject<void>();

  // The underlying native element of CodemirrorComponent view.
  nativeElement: HTMLElement;

  codemirror: EditorView = new EditorView();

  /** Whether the control is focused. */
  @Input()
  get focused(): boolean {
    // console.log(`get focused() -> ${this._focused}`);
    return this._focused;
  }
  set focused(value: boolean) {
    // console.log(`set focused(${value})`);
    this._focused = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _focused = false;

  // Needed to dynamically change the Codemirror config.
  private codemirrorEnabled = new Compartment();

  /** Whether the control is disabled. */
  @Input()
  get disabled(): boolean {
    // console.log(`get disabled() -> ${this._disabled}`);
    return this._disabled;
  }
  set disabled(value: boolean) {
    // console.log(`set disabled(${value})`);
    this.codemirror.dispatch({
      effects: this.codemirrorEnabled.reconfigure(
        EditorView.editable.of(!value)
      ),
    });
    this._disabled = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _disabled = false;

  @Input()
  get value(): Text {
    // console.log(`get value(${this._value})`);
    // for giant documents it’s going to do quite a lot of string concatenation
    // so depending on your use case you might not want to constantly do it when you can avoid it
    return this.codemirror.state.doc;
  }
  set value(value: Text) {
    // console.log(`set value(${value})`);

    const transaction: Transaction = this.codemirror.state.update({
      changes: {
        from: 0,
        to: this.codemirror.state.doc.length,
        insert: value,
      },
    });
    this.codemirror.dispatch(transaction);
    this._value = value;
    this.stateChanges.next();
  }
  private _value: Text = Text.empty;

  constructor(
    @Optional() @Self() public ngControl: NgControl,
    private readonly focusMonitor: FocusMonitor,
    private readonly elementRef: ElementRef
  ) {
    // The codemirror View will be attached to the underlying native element.
    this.nativeElement = elementRef.nativeElement;

    // The NgControl for this control.
    if (this.ngControl) {
      // Setting the value accessor directly to avoid a circular import.
      this.ngControl.valueAccessor = this;
    }

    this.focusMonitor
      .monitor(this.elementRef.nativeElement, true)
      .subscribe((origin: FocusOrigin) => {
        // origin is "touch", "mouse", "keyboard", "program", or null.
        // It is null when it loses focus.
        if (this.focused && !origin) {
          this._onTouched();
        }
        // If there is no origin (i.e. null) the control is not focused.
        this.focused = !!origin;
        this.stateChanges.next();
      });
  }

  ngAfterViewInit(): void {
    const darkTheme = EditorView.theme({}, { dark: false });

    const editable: Extension = this.codemirrorEnabled.of(
      EditorView.editable.of(!this.disabled)
    );

    const changeHandler: Extension = EditorView.updateListener.of(
      (v: ViewUpdate) => {
        if (v.docChanged) {
          this._onChange(this.codemirror.state.doc);
        }
      }
    );

    this.codemirror = new EditorView({
      parent: this.codemirrorHost?.nativeElement,
      state: EditorState.create({
        // TODO: toString() needed to avoid newline characters
        // see https://discuss.codemirror.net/t/controlvalueaccessor-string-concatenation/3274/6
        doc: this._value.toString(),
        extensions: [basicSetup, darkTheme, editable, changeHandler, python()],
      }),
    });
  }

  ngOnDestroy(): void {
    this.stateChanges.complete();
    this.focusMonitor.stopMonitoring(this.elementRef);
  }

  // Implement ControlValueAccessor (https://angular.io/api/forms/ControlValueAccessor).
  // ===================================================================================

  /**
   * Writes a new value to the element. This method is called by the forms API
   * to write to the view when programmatic changes from model to view are
   * requested.
   * @param value The new value for the element.
   */
  writeValue(obj: any): void {
    // console.log(`writeValue(${obj})`);
    this.value = obj;
  }

  /**
   * Registers a callback function that is called when the control's value
   * changes in the UI.
   * @param fn The callback function to register
   */
  registerOnChange(fn: any): void {
    // console.log(`registerOnChange(${fn})`);
    // Store the provided function as an internal method.
    this._onChange = fn;
  }

  /**
   * Registers a callback function is called by the forms API on initialization
   * to update the form model on blur.
   * @param fn The callback function to register
   */
  registerOnTouched(fn: any): void {
    // console.log(`registerOnTouched(${fn})`);
    // Store the provided function as an internal method.
    this._onTouched = fn;
  }

  /**
   * Function that is called by the forms API when the control status changes to
   * or from 'DISABLED'.
   * @param value The disabled status to set on the element
   */
  setDisabledState(value: boolean): void {
    // console.log(`setDisabledState(${value})`);
    this.disabled = value;
  }

  /**
   * The callback function to register on UI change.
   * @param _
   */
  private _onChange(value: Text): any {
    console.log(`_onChange(${value})`);
  }

  /**
   * The method set in registerOnTouched. It is just a placeholder method.
   * Use it to emit changes back to the form.
   */
  private _onTouched(): any {
    console.warn(`_onTouched not implemented`);
  }
}