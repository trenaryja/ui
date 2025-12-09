import { defineConfig } from '@fullstacksjs/eslint-config'

/** @type {import('eslint').Linter.Config[]} */
const config = [
	...defineConfig({
		files: ['**/*.ts', '**/*.tsx'],
		rules: {
			radix: 'off',
			'perfectionist/sort-imports': 'off',
			'@typescript-eslint/consistent-type-definitions': ['error', 'type'],
			'storybook/csf-component': 'off',
			'jsx-a11y/no-noninteractive-element-interactions': 'off',
			'jsx-a11y/click-events-have-key-events': 'off',
			'@eslint-react/no-children-to-array': 'off',
			'@eslint-react/no-clone-element': 'off',
		},
	}),
]

export default config
