import {
  Component,
  ChangeDetectionStrategy,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { EditorState, EditorView, basicSetup } from '@codemirror/basic-setup';
import { python } from '@codemirror/lang-python';
import { ViewUpdate } from '@codemirror/view';

import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} from 'unique-names-generator';

import { Script } from '@gnosys/interfaces';

import { DialogService } from '@ngneat/dialog';
import { DialogAreyousureComponent } from '../dialog-areyousure/dialog-areyousure.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditorComponent implements AfterViewInit {
  @ViewChild('editor') editorElmRef: ElementRef | undefined;
  @Output() script: EventEmitter<Script> = new EventEmitter<Script>();
  @Output() run: EventEmitter<Array<string>> = new EventEmitter<
    Array<string>
  >();
  @Output() newScript = new EventEmitter();
  editorDiv: HTMLDivElement | undefined;
  editorView: EditorView | undefined;
  randomName = this.newRandomName();
  docChanged = false;

  constructor(
    private dialog: DialogService
  ) {}

  ngAfterViewInit(): void {
    if (this.editorElmRef) {
      this.editorDiv = this.editorElmRef.nativeElement;
      this.editorView = new EditorView({
        state: EditorState.create({
          extensions: [
            basicSetup,
            python(),
            EditorView.updateListener.of((v: ViewUpdate) => {
              if (v.docChanged) {
                this.docChanged = true;
              }
            }),
          ],
        }),
        parent: this.editorDiv,
      });
    }
  }

  newRandomName() {
    return uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
    });
  }

  clearEditorDocument() {
    if (this.editorView) {
      this.editorView.dispatch({
        changes: { from: 0, to: this.editorView.state.doc.length },
      });
    }
  }

  onSave() {
    if (this.editorView) {
      this.script.emit({
        id: '',
        email:'',
        name: this.randomName,
        description:'',
        code: this.editorView.state.doc.toJSON(),
        language: 'python',
        loading: false
      });
      this.docChanged = false;
      this.randomName = this.newRandomName();
    }
  }

  onNew() {
    if (this.docChanged) {
      this.dialog
        .open(DialogAreyousureComponent, {
          size: 'sm',
          data: {
            body: 'Your script is not saved! If you procceed your changes will be lost!',
          },
        })
        .afterClosed$.subscribe((val) => {
          if (val) {
            this.randomName = this.newRandomName();
            this.clearEditorDocument();
          }
        });
    }
  }

  onOpen() {
    console.log('On open click');
  }

  onRun() {
    if (this.editorView) {
      this.run.emit(this.editorView.state.doc.toJSON());
    }
  }
}
