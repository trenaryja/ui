import { defineConfig } from '@fullstacksjs/eslint-config'

/** @type {import('eslint').Linter.Config[]} */
const config = [
	...defineConfig({
		files: ['**/*.ts', '**/*.tsx'],
		rules: {
			radix: 'off',
			'@eslint-react/hooks-extra/no-direct-set-state-in-use-effect': 'off',
			'@eslint-react/no-children-to-array': 'off',
			'@eslint-react/no-clone-element': 'off',
			'@typescript-eslint/consistent-type-definitions': ['error', 'type'],
			'jsx-a11y/click-events-have-key-events': 'off',
			'jsx-a11y/no-noninteractive-element-interactions': 'off',
			'perfectionist/sort-imports': 'off',
			'storybook/csf-component': 'off',
		},
	}),
]

export default config
