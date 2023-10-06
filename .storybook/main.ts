import { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
  stories: ['../src/index.stories.tsx', '../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
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
