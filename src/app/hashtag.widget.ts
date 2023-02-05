import {
  Decoration,
  DecorationSet,
  EditorView,
  MatchDecorator,
  ViewPlugin,
  ViewUpdate,
  WidgetType
} from "@codemirror/view";

class HashtagWidget extends WidgetType {
  constructor(private readonly tag: string) { super() }

  override toDOM(): HTMLElement {
    const wrap = document.createElement("span")
    wrap.textContent = '#'+this.tag
    wrap.className = "cm-hashtag"
    return wrap
  }

  override ignoreEvent(): boolean { return false }
}

const hashTagMatchDecorator = new MatchDecorator({
  regexp: /#([^ ]+)/g,
  decoration: match => Decoration.replace({
    widget: new HashtagWidget(match[1]),
  })
})

export const hashtagMatcher = ViewPlugin.fromClass(class {
  placeholders: DecorationSet
  constructor(view: EditorView) {
    this.placeholders = hashTagMatchDecorator.createDeco(view)
  }
  update(update: ViewUpdate) {
    this.placeholders = hashTagMatchDecorator.updateDeco(update, this.placeholders)
  }
}, {
  decorations: instance => instance.placeholders,
  provide: plugin => EditorView.atomicRanges.of(view => {
    return view.plugin(plugin)?.placeholders || Decoration.none
  })
})
