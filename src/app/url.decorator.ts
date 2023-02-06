import {
  Decoration,
  DecorationSet,
  EditorView,
  MatchDecorator,
  ViewPlugin,
  ViewUpdate
} from "@codemirror/view";

const urlDecoration = Decoration.mark({class: "cm-url", inclusive: true})

const urlMatchDecorator = new MatchDecorator({
  regexp: /(https?:\/\/[.a-zA-Z0-9_\-]+\.[a-zA-Z0-9_\-]+)/g,
  decoration: urlDecoration
})

export const urlDecorator = ViewPlugin.fromClass(class {
  placeholders: DecorationSet
  constructor(view: EditorView) {
    this.placeholders = urlMatchDecorator.createDeco(view)
  }
  update(update: ViewUpdate) {
    this.placeholders = urlMatchDecorator.updateDeco(update, this.placeholders)
  }
}, {
  decorations: instance => instance.placeholders,
})
