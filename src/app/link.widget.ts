import {Decoration, DecorationSet, EditorView, ViewPlugin, ViewUpdate, WidgetType} from "@codemirror/view"
import {syntaxTree} from "@codemirror/language";

class OpenLinkWidget extends WidgetType {
  constructor(readonly url: string) { super() }

  override eq(other: OpenLinkWidget) { return other.url == this.url }

  override toDOM() {
    let wrap = document.createElement("a");
    wrap.setAttribute("aria-hidden", "true");
    wrap.setAttribute("href", this.url);
    wrap.setAttribute("class", 'cm-open-link');
    wrap.textContent = '🔗';
    return wrap;
  }

  override ignoreEvent() { return false }
}

function linkWidgets(view: EditorView) {
  let widgets: any[] = []
  for (let {from, to} of view.visibleRanges) {
    syntaxTree(view.state).iterate({
      from, to,
      enter: (node) => {
        console.log('node.name', node.name)
        if (node.name == "URL") {
        //   let isTrue = view.state.doc.sliceString(node.from, node.to) == "true"
          let deco = Decoration.widget({
            widget: new OpenLinkWidget(view.state.doc.sliceString(node.from, node.to)),
            side: 1
          })
          widgets.push(deco.range(node.to))
        }
      }
    })
  }
  return Decoration.set(widgets)
}

export const linkWidget = ViewPlugin.fromClass(class {
  decorations: DecorationSet

  constructor(view: EditorView) {
    this.decorations = linkWidgets(view)
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged)
      this.decorations = linkWidgets(update.view)
  }
}, {
  decorations: v => v.decorations,
})
