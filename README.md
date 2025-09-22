<h1 align="center">@trenaryja/ui</h1>

<p align="center">
  <img src="https://trenary.dev/icon.svg" alt="logo" width="80" />
</p>

This library is a collection of reusable UI components for my projects. There's no real system or pattern in place, just a hodge-podge of random components/ideas that I've come up with. If it inspires you, or you somehow find any of it useful, then hell yeah please tell me about it!

[![Storybook](https://img.shields.io/badge/Storybook-gray?&style=badge&logo=storybook&logoColor=white)](https://ui.trenary.dev)
[![Github](https://img.shields.io/badge/Github-gray?&style=badge&logo=github&logoColor=white)](https://github.com/trenaryja/ui)
[![npm](https://img.shields.io/npm/v/@trenaryja/ui?&style=badge&logo=npm&logoColor=white&color=black)](https://www.npmjs.com/package/@trenaryja/ui)
[![Bundlephobia](https://img.shields.io/bundlejs/size/@trenaryja/ui?logoColor=white&style=badge&label=Bundlephobia&logo=webpack&color=black)](https://bundlephobia.com/package/@trenaryja/ui)

## Getting Started

### React Application

This library assumes you already have tailwind setup.

1. Install the library

```sh
pnpm i @trenary/ui
```

2. Import the library's css into your app's css

```css
@import 'trenaryja/ui/css';
```

### Browser

If you'd like to try this out in the browser, like maybe in a [new pen](https://pen.new) on codepen.io, just dump these tags into your html:

```html
<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser"></script>
<link href="https://cdn.jsdelivr.net/npm/@trenaryja/ui" rel="stylesheet" type="text/css" />
```

## What tools are used?

### Build Tools

- 📦 [pnpm](https://pnpm.io)
- ⚡️ [tsup](https://github.com/egoist/tsup)
- ☑️ [eslint](https://eslint.org)
- 🎨 [prettier](https://prettier.io)

### Publish Tools

- 📖 [storybook](https://storybook.js.org)
- 🔼 [release-it](https://github.com/release-it/release-it)
- 🐙 [github actions](https://docs.github.com/en/actions)

### Peer Dependencies

- ⚛️ [react](https://react.dev)
- 🌊 [tailwindcss](https://tailwindcss.com/)
- 🌼 [daisyui](https://daisyui.com/)
