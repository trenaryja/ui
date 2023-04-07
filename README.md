# @trenary/ui

This library is a collection of reusable UI components for my projects. There's no real system or pattern in place, just a hodge-podge of random components/ideas that I've come up with. If it inspires you, or you somehow find any of it useful, then hell yeah please tell me about it!

[![Storybook](https://img.shields.io/badge/Storybook-gray?logo=storybook)](https://trenaryja.github.io/ui)
[![Github](https://img.shields.io/badge/Github-gray?logo=github)](https://github.com/trenaryja/ui)
[![npm](https://img.shields.io/badge/npm-gray?logo=npm)](https://www.npmjs.com/package/@trenaryja/ui)

## Getting Started

```console
npm install @trenary/ui
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

### Linking/Testing

Often times you want to link the package you're developing to another project locally to test it out to circumvent the need to publish it to NPM.

For this we use `yalc` which is a tool for local package development and simulating the publishing and installation of packages. Make sure it is globally installed, then in a project where you want to consume your package simply run:

```console
yalc add my-react-package
```

### Releasing, tagging & publishing to NPM

Create a semantic version tag and publish to Github Releases. When a new release is detected a Github Action will automatically build the package and publish it to NPM. Additionally, a Storybook will be published to Github pages.

```console
pnpm run release
```

## What tools are used?

- 📦[pnpm](https://pnpm.io/) - Fast, disk space efficient package manager
- ⚡️[tsup](https://github.com/egoist/tsup) - The simplest and fastest way to bundle your TypeScript libraries. Used to bundle package as ESM and CJS modules.
- 🔗 [Yalc](https://github.com/wclr/yalc) - Better workflow than npm link for package authors.
- 📖 [Storybook](https://storybook.js.org/) - Build UI components and pages in isolation. It streamlines UI development, testing, and documentation.
- 🔼 [Release-it](https://github.com/release-it/release-it/) - A command line tool to automatically generate a new GitHub/NPM Release
- 🐙 [Github Actions](https://docs.github.com/en/actions) - CI/CD workflows that integrate with Github Releases to automate publishing the package to NPM and Storybook to Github Pages.
- ☑️ [ESLint](https://eslint.org/) - A linter for JavaScript.
- 🎨 [Prettier](https://prettier.io/) - An opinionated code formatter.
