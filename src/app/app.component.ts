import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {EditorState} from "@codemirror/state";
import {flatIndent, Language, language} from "@codemirror/language";
import {defaultKeymap, history, historyKeymap} from "@codemirror/commands";
import {
  EditorView,
  drawSelection,
  gutter,
  highlightActiveLine,
  keymap,
  lineNumbers, Decoration, WidgetType, ViewPlugin, DecorationSet, ViewUpdate,
} from "@codemirror/view";
import {MatchDecorator} from "@codemirror/view"
import {urlMatcher} from "./url.widget";
import {hashtagMatcher} from "./hashtag.widget";
import {CompletionContext} from "@codemirror/autocomplete"

function myCompletions(context: CompletionContext) {
  let word = context.matchBefore(/\w*/)
  if (!word || (word.from == word.to && !context.explicit))
    return null
  return {
    from: word.from,
    options: [
      {label: "match", type: "keyword"},
      {label: "hello", type: "variable", info: "(World)"},
      {label: "magic", type: "text", apply: "⠁⭒*.✩.*⭒⠁", detail: "macro"}
    ]
  }
}

// language.of(Language.)


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('editor')
  editor!: ElementRef<HTMLDivElement>

  ngAfterViewInit(): void {
    const extensions = [
      // history(),
      // drawSelection(),
      // EditorState.allowMultipleSelections.of(true),
      // gutter({
      //   renderEmptyElements: true
      // }),
      // lineNumbers(),
      // highlightActiveLine(),
      // keymap.of([
      //   ...defaultKeymap,
      //   ...historyKeymap
      // ]),
      urlMatcher.extension,
      hashtagMatcher.extension
      // oneDark
    ]
    const doc = `check out this link https://example.com

    I think this is true, not false

    [ ] tomatoes
    [x] apples
    [ ] butter
    `;
    const state = EditorState.create({ doc, extensions })

    const view = new EditorView({ state })
    this.editor.nativeElement.append(view.dom);
  }

}
