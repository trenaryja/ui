## What's included?

- ⚡️[tsup](https://github.com/egoist/tsup) - The simplest and fastest way to bundle your TypeScript libraries. Used to bundle package as ESM and CJS modules. Supports TypeScript, Code Splitting, PostCSS, and more out of the box.
- 🔗 [Yalc](https://github.com/wclr/yalc) - Better workflow than npm | pnpm run link for package authors.
- 📖 [Storybook](https://storybook.js.org/) - Build UI components and pages in isolation. It streamlines UI development, testing, and documentation.
- 🔼 [Release-it](https://github.com/release-it/release-it/) - release-it is a command line tool to automatically generate a new GitHub Release and populates it with the changes (commits) made since the last release.
- 🐙 [Publish via Github Actions](https://docs.github.com/en/actions) - CI/CD workflows for your package. Integrate with Github Releases to automate publishing package to NPM and Storybook to Github Pages.
- ☑️ [ESLint](https://eslint.org/) - A linter for JavaScript. Includes a simple configuration for React projects based on the recommended ESLint configs.
- 🎨 [Prettier](https://prettier.io/) - An opinionated code formatter.

## Usage

### Developing

Watch and rebuild code with `tsup` and runs Storybook to preview your UI during development.

```console
pnpm run dev
```

### Building

Build package with `tsup` for production.

```console
pnpm run build
```

### Linking

Often times you want to `link` the package you're developing to another project locally to test it out to circumvent the need to publish it to NPM.

For this we use [yalc](https://github.com/wclr/yalc) which is a tool for local package development and simulating the publishing and installation of packages. Make sure it is globally installed, then in a project where you want to consume your package simply run:

```console
yalc add my-react-package
```

Learn more about `yalc` [here](https://github.com/wclr/yalc).

### Releasing, tagging & publishing to NPM

Create a semantic version tag and publish to Github Releases. When a new release is detected a Github Action will automatically build the package and publish it to NPM. Additionally, a Storybook will be published to Github pages.

Learn more about how to use the `release-it` command [here](https://github.com/release-it/release-it).

```console
pnpm run release
```

When you are ready to publish to NPM simply run the following command:

```console
pnpm run publish
```

#### Auto publish after Github Release

❗Important note: in order to publish package to NPM you must add your token as a Github Action secret. Learn more on how to configure your repository and publish packages through Github Actions [here](https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages).
