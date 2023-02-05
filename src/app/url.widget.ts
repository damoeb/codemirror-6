import {Decoration, DecorationSet, EditorView, MatchDecorator, ViewPlugin, ViewUpdate} from "@codemirror/view";

const urlDecoration = Decoration.mark({class: "cm-url"})

const urlMatchDecorator = new MatchDecorator({
  regexp: /(https?:\/\/[.a-zA-Z0-9_\-]+\.[a-zA-Z0-9_\-]+)/g,
  decoration: match => urlDecoration
})

export const urlMatcher = ViewPlugin.fromClass(class {
  placeholders: DecorationSet
  constructor(view: EditorView) {
    this.placeholders = urlMatchDecorator.createDeco(view)
  }
  update(update: ViewUpdate) {
    this.placeholders = urlMatchDecorator.updateDeco(update, this.placeholders)
  }
}, {
  decorations: instance => instance.placeholders,
  provide: plugin => EditorView.atomicRanges.of(view => {
    return view.plugin(plugin)?.placeholders || Decoration.none
  })
})
