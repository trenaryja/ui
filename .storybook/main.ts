import type { StorybookConfig } from '@storybook/react-vite'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { mergeConfig } from 'vite'

const rootDir = dirname(fileURLToPath(import.meta.url))

const config: StorybookConfig = {
	addons: ['@storybook/addon-themes'],
	logLevel: 'silent',
	stories: ['../**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
	framework: { name: '@storybook/react-vite', options: {} },
	features: { controls: false, actions: false, interactions: false },
	viteFinal: async (inlineConfig) =>
		mergeConfig(inlineConfig, {
			resolve: { alias: { '@': resolve(rootDir, '../src') } },
		}),
}

export default config
