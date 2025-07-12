import { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/index.stories.tsx', '../src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  logLevel: 'silent',
}

export default config
