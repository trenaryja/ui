import { StorybookConfig } from '@storybook/react-vite'
import path from 'path'
import { mergeConfig } from 'vite'

const config: StorybookConfig = {
	addons: ['@storybook/addon-themes'],
	logLevel: 'silent',
	stories: ['../stories/README.stories.tsx', '../**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
	framework: {
		name: '@storybook/react-vite',
		options: {},
	},
	features: {
		actions: false,
		interactions: false,
	},
	viteFinal: async (config) => {
		return mergeConfig(config, {
			resolve: {
				alias: {
					'@': path.resolve(__dirname, '../src'),
				},
			},
		})
	},
}

export default config
