import { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/index.stories.tsx', '../src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
  addons: [
    {
      name: '@storybook/addon-essentials',
      options: {
        actions: false,
      },
    },
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  logLevel: 'silent',
  docs: { autodocs: false },
}

export default config
