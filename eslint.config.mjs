import reactHooks from 'eslint-plugin-react-hooks'
import storybook from 'eslint-plugin-storybook'
import tseslint from 'typescript-eslint'

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
	{ ignores: ['dist', 'storybook-static/*'] },
	...tseslint.configs.recommended,
	...storybook.configs['flat/recommended'],
	reactHooks.configs['recommended-latest'],

	{
		files: ['**/*.stories.@(ts|tsx)'],
		rules: {
			'react-hooks/rules-of-hooks': 'off',
		},
	},
	{
		rules: {
			'react/no-unescaped-entities': 'off',
			'@typescript-eslint/no-namespace': 'off',
			'@typescript-eslint/no-empty-object-type': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
				},
			],
		},
	},
]

export default eslintConfig
