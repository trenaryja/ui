import { defineConfig } from '@fullstacksjs/eslint-config'

/** @type {import('eslint').Linter.Config[]} */
const config = [
	...defineConfig({
		files: ['**/*.ts', '**/*.tsx'],
		rules: {
			radix: 'off',
			'@eslint-react/no-children-to-array': 'off',
			'@eslint-react/no-clone-element': 'off',
			'@eslint-react/no-missing-context-display-name': 'off',
			'no-bitwise': 'off',
			'no-plusplus': 'off',
			'perfectionist/sort-imports': 'off', // handled by vscode organize imports

			'@typescript-eslint/consistent-type-definitions': ['error', 'type'],
			'@typescript-eslint/no-unnecessary-type-assertion': 'error',
			'@typescript-eslint/prefer-nullish-coalescing': 'error',
		},
	}),
]

export default config
