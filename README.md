# @trenary/ui

This library is a collection of reusable UI components for my projects. There's no real system or pattern in place, just a hodge-podge of random components/ideas that I've come up with. If it inspires you, or you somehow find any of it useful, then hell yeah please tell me about it!

[![Storybook](https://img.shields.io/badge/Storybook-gray?&style=badge&logo=storybook&logoColor=white)](https://trenaryja.github.io/ui)
[![Github](https://img.shields.io/badge/Github-gray?&style=badge&logo=github&logoColor=white)](https://github.com/trenaryja/ui)
[![npm](https://img.shields.io/npm/v/@trenaryja/ui?&style=badge&logo=npm&logoColor=white&color=black)](https://www.npmjs.com/package/@trenaryja/ui)
[![Bundlephobia](https://img.shields.io/bundlejs/size/@trenaryja/ui?logoColor=white&style=badge&label=Bundlephobia&logo=webpack&color=black)](https://bundlephobia.com/package/@trenaryja/ui)

## Getting Started

```console
pnpm install @trenary/ui
```

## Developing

Watch and rebuild code with `tsup` and runs Storybook to preview your UI during development.

```console
pnpm run dev
```

### Building

Build package with `tsup` for production.

```console
pnpm run build
```

### Releasing, tagging & publishing to NPM

Create a semantic version tag and publish to Github Releases. When a new release is detected a Github Action will automatically build the package and publish it to NPM. Additionally, a Storybook will be published to Github pages.

```console
pnpm run release
```

## What tools are used?

- 📦[pnpm](https://pnpm.io/) - Fast, disk space efficient package manager
- ⚡️[tsup](https://github.com/egoist/tsup) - The simplest and fastest way to bundle your TypeScript libraries. Used to bundle package as ESM and CJS modules.
- 📖 [Storybook](https://storybook.js.org/) - Build UI components and pages in isolation. It streamlines UI development, testing, and documentation.
- 🔼 [Release-it](https://github.com/release-it/release-it/) - A command line tool to automatically generate a new GitHub/NPM Release
- 🐙 [Github Actions](https://docs.github.com/en/actions) - CI/CD workflows that integrate with Github Releases to automate publishing the package to NPM and Storybook to Github Pages.
- ☑️ [ESLint](https://eslint.org/) - A linter for JavaScript.
- 🎨 [Prettier](https://prettier.io/) - An opinionated code formatter.
