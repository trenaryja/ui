import { withThemeByDataAttribute } from '@storybook/addon-themes'
import type { Preview } from '@storybook/react-vite'
import * as R from 'remeda'
import type { DaisyThemeName } from '../src'
import { daisyThemes } from '../src'
import './storybook.css'

export const themes = R.pipe(
	daisyThemes,
	R.entries(),
	R.map(([name, theme]) => ({
		name: name as DaisyThemeName,
		mode: theme['color-scheme'] as 'dark' | 'light',
	})),
	R.sortBy((x) => x.name !== 'light' && x.name !== 'dark', R.prop('mode'), R.prop('name')),
)

const symbols = {
	dark: '◐',
	light: '◑',
} as const

const preview: Preview = {
	decorators: [
		withThemeByDataAttribute({
			themes: Object.fromEntries(themes.map((x) => [`${symbols[x.mode]} ${x.name}`, x.name])),
			defaultTheme: `${symbols.dark} dark`,
			attributeName: 'data-theme',
		}),
	],
}

export default preview
