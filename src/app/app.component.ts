import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {EditorState, Extension} from "@codemirror/state";
import {
  drawSelection,
  EditorView,
  gutter,
  highlightActiveLine,
  highlightSpecialChars,
  lineNumbers,
} from "@codemirror/view";
import {bracketMatching, foldGutter, indentOnInput, syntaxTree} from "@codemirror/language";
import {highlightSelectionMatches} from "@codemirror/search";
import {autocompletion, closeBrackets, CompletionContext, CompletionResult} from "@codemirror/autocomplete";
import {markdownLanguage} from "@codemirror/lang-markdown";
import {markdownLanguageSupport} from "./markdown.lang";
import {theme} from "./theme";
import {markdownDecorator} from "./markdown.decorator";
import {hashtagMatcher} from "./hashtag.widget";
import {urlDecorator} from "./url.decorator";
import {linkWidget} from "./link.widget";

// function myCompletions(context: CompletionContext) {
//   let word = context.matchBefore(/\w*/)
//   if (!word || (word.from == word.to && !context.explicit))
//     return null
//   return {
//     from: word.from,
//     options: [
//       {label: "match", type: "keyword"},
//       {label: "hello", type: "variable", info: "(World)"},
//       {label: "magic", type: "text", apply: "⠁⭒*.✩.*⭒⠁", detail: "macro"}
//     ]
//   }
// }

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
    const tagValue = '#this-tag';
    const boldValue = '**bold letters**';
    const italicValue = '_italic text_';
    const strikeValue = '~~The flat.~~';
    const codeValue = '`JavaScript or kotlin`';
    const taskList = `
    [ ] no
    [x] yes
    [*] also yes
    `;
    const blockquote = `
    look at his
    > blockquote
    > here
    fertig
    `
    const scriptValue = `[[

whatever you say

]]`;
// const linkValue = '[title](https://dersfff.com)';
// const wikiLinkValue = '[[title]]';
    const superscriptValue = 'X^2^';
    const subscriptValue = 'H~2~O';
// const embedValue = '![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")';
    const embedValue = '![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png)';
    const urlValue = 'https://www.example.com';
    const linkTextValue = '[2020-03/dw34fhe]';

    const updateListener = EditorView.updateListener.of((v) => {
      if (v.docChanged) {
        console.log('change');
      }
    });

    const extensions: Extension[] = [
      // history(),
      gutter({
        renderEmptyElements: true
      }),
      lineNumbers(),
      highlightSpecialChars(),
      foldGutter(),
      drawSelection(),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      bracketMatching(),
      closeBrackets(),
      autocompletion({
        selectOnOpen: true,
        activateOnTyping: true,
        closeOnBlur: true,

        override: [async (context: CompletionContext): Promise<CompletionResult|null> => {
          const nodeBefore = syntaxTree(context.state).resolveInner(context.pos, -1)
          const textBefore = context.state.sliceDoc(nodeBefore.from, context.pos)
          const tagBefore = /@\w*$/.exec(textBefore)
          if (!tagBefore && !context.explicit) return null
          return {
            from: tagBefore ? nodeBefore.from + tagBefore.index : context.pos,
            options: [
              {label: "Cognitive Bias", apply: '1234-wefwef',  type: "text"}
            ],
            validFor: /^(@\w*)?$/
          }
        }
]      }),
      // rectangularSelection(),
      highlightActiveLine(),
      highlightSelectionMatches(),
      // keymap.of([
      //   ...closeBracketsKeymap,
      //   // ...defaultKeymap,
      //   // ...historyKeymap,
      //   // ...foldKeymap,
      //   // ...commentKeymap,
      //   // ...completionKeymap,
      //   // ...lintKeymap
      // ]),
      // defaultHighlightStyle,
      hashtagMatcher,
      markdownLanguageSupport,
      updateListener,
      theme,
      // checkboxPlugin.extension,
      markdownDecorator,
      urlDecorator,
      linkWidget
    ];

    const doc = `
# H1
## H2
### H3
#### H4
##### H5
###### H6

Alternatively, for H1 and H2, an underline-ish style:

Alt-H1
======

Alt-H2
------

# Tags
#this #or-that

# Emphasis
Emphasis, aka italics, with *asterisks* or _underscores_.

Strong emphasis, aka bold, with **asterisks** or __underscores__.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~

# Text
Sub Script ${subscriptValue}
Super Script ${superscriptValue}

# Lists
1. First ordered list item
2. Another item
  * Unordered sub-list.
1. Actual numbers don't matter, just that it's a number
  1. Ordered sub-list
4. And another item.


# Links
[I'm an inline-style link](https://www.google.com)

[I'm an inline-style link with title](https://www.google.com "Google's Homepage")

[I'm a reference-style link][Arbitrary case-insensitive reference text]

[I'm a relative reference to a repository file](../blob/master/LICENSE)

[You can use numbers for reference-style link definitions][1]

Or leave it empty and use the [link text itself].

URLs and URLs in angle brackets will automatically get turned into links.
http://www.example.com or <http://www.example.com> and sometimes
example.com (but not on Github, for example).

Some text to show that the reference links can follow later.

[arbitrary case-insensitive reference text]: https://www.mozilla.org
[1]: http://slashdot.org
[link text itself]: http://www.reddit.com


# Images
Here's our logo (hover to see the title text):

Inline-style:
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")

Reference-style:
![alt text][logo]

[logo]: https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 2"


# Code
\`\`\`javascript
var s = "JavaScript syntax highlighting";
alert(s);
\`\`\`


# Tables
| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |


# Blockquotes
> Blockquotes are very handy in email to emulate reply text.
> This line is part of the same quote.

Quote break.

> This is a very long line that will still be quoted properly when it wraps. Oh boy let's keep writing to make sure this is long enough to actually wrap for everyone. Oh, you can *put* **Markdown** into a blockquote.
    `;
    const state = EditorState.create({ doc, extensions })

    new EditorView({
      state,
      parent: this.editor.nativeElement,
    });
  }

}
