import { StorybookConfig } from '@storybook/react-vite'

const config: StorybookConfig = {
	stories: ['../**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],

	framework: {
		name: '@storybook/react-vite',
		options: {},
	},

	logLevel: 'silent',
	addons: ['@storybook/addon-themes'],
	features: {
		actions: false,
		interactions: false,
	},
}

export default config
