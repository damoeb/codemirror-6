import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {EditorState} from "@codemirror/state";
import {defaultKeymap, history, historyKeymap} from "@codemirror/commands";
import {EditorView, drawSelection, gutter, highlightActiveLine, keymap, lineNumbers} from "@codemirror/view";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('editor')
  editor: ElementRef<HTMLDivElement>

  ngOnInit(): void {
    const extensions = [
      history(),
      drawSelection(),
      EditorState.allowMultipleSelections.of(true),
      gutter({
        renderEmptyElements: true
      }),
      lineNumbers(),
      highlightActiveLine(),
      keymap.of([
        ...defaultKeymap,
        ...historyKeymap
      ]),
      // oneDark
    ]
    const doc = "hello\nworld";
    const state = EditorState.create({ doc, extensions })

    const view = new EditorView({ state })
    this.editor.nativeElement.append(view.dom);
  }

}
