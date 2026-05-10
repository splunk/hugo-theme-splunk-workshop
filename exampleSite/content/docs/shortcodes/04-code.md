+++
title       = "Code blocks"
description = "Fenced blocks, the highlight shortcode, line highlights, filename headers, copy buttons."
weight      = 40
+++

{{< lead >}}
Code is what makes a workshop a workshop. The theme treats fenced code blocks as a first-class citizen — every block gets a copy button, optional file-name header, optional line highlighting, and theme-aware syntax colors.
{{< /lead >}}

## Standard fenced block

````markdown
```js
function hello(name) {
  return `Hello, ${name}!`;
}
```
````

Renders as:

```js
function hello(name) {
  return `Hello, ${name}!`;
}
```

The copy button in the top-right is wired by `assets/js/copy-code.js` and uses the Clipboard API.

## With a filename

````markdown
```js {file="hello.js"}
function hello(name) {
  return `Hello, ${name}!`;
}
```
````

```js {file="hello.js"}
function hello(name) {
  return `Hello, ${name}!`;
}
```

The `{file="..."}` attribute swaps the language label for a filename pill. Use this for any block that represents a real file the reader will create or edit.

## With line highlighting

````markdown
```js {file="hello.js" hl_lines="2-3"}
function hello(name) {
  if (!name) throw new Error("name required");
  return `Hello, ${name}!`;
}
```
````

```js {file="hello.js" hl_lines="2-3"}
function hello(name) {
  if (!name) throw new Error("name required");
  return `Hello, ${name}!`;
}
```

`hl_lines` accepts ranges (`2-3`) and individual lines (`1 4 7`).

## The `highlight` shortcode (alternative syntax)

If you prefer the relearn-style explicit shortcode:

```markdown
{{</* highlight go "linenos=true,hl_lines=2 5" */>}}
package main

import "fmt"

func main() {
  fmt.Println("hello, hugo")
}
{{</* /highlight */>}}
```

Renders as:

{{< highlight go "linenos=true,hl_lines=2 5" >}}
package main

import "fmt"

func main() {
  fmt.Println("hello, hugo")
}
{{< /highlight >}}

This form is identical to the fenced block but lets you pass the language and options explicitly. Use it when you need line numbers or want a more visible `<details>`-style configuration.

## Languages supported

Hugo's built-in highlighter is [Chroma](https://github.com/alecthomas/chroma), which supports 250+ languages. Common ones for workshops:

- `bash`, `shell`, `zsh` — command-line snippets
- `js`, `ts`, `python`, `go`, `rust`, `java`, `c`, `cpp` — source code
- `json`, `yaml`, `toml` — config
- `dockerfile`, `nginx`, `terraform` — infrastructure
- `sql`, `spl` — query languages
- `text` (or no language) — plain output

If you need a language that doesn't render correctly, check [the Chroma language list](https://github.com/alecthomas/chroma#supported-languages) — sometimes the alias differs (e.g. `tsx` instead of `typescript`).

## Theme-aware syntax colors

The Splunk-flavored Chroma theme lives in `assets/css/code.css`. It uses CSS custom properties so dark mode just works. If you want different syntax colors, override the `.chroma` rules in your own CSS — Hugo concatenates `assets/css/` files in order, so a later file can override.

## When to use what

| Block type | Reach for it when… |
| --- | --- |
| Fenced block (` ``` `) | 95% of the time. Default. |
| Fenced + `{file="..."}` | The block represents a real file the reader will create. |
| Fenced + `{hl_lines="..."}` | You want to draw attention to specific lines. |
| `highlight` shortcode | You need explicit Chroma options the fenced syntax doesn't support. |
| `terminal` shortcode | The block is a shell session — output mixed with commands. |
| `file` shortcode (inline) | You're naming a file in prose, not showing its contents. |
