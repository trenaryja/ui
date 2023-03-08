import { StorybookConfig } from '@storybook/core-common'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: ['@storybook/addon-essentials'],
  framework: '@storybook/react',
  features: { postcss: false },
  logLevel: 'silent',
}

export default config
