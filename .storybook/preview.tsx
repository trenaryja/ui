import { withThemeByDataAttribute } from '@storybook/addon-themes'
import type { Preview } from '@storybook/react-vite'
import { daisyThemes } from '../src'
import './storybook.css'

const symbols = {
	dark: '◐',
	light: '◑',
} as const

const preview: Preview = {
	decorators: [
		// (Story) => (
		// 	<ThemeProvider
		// 		enableSystem
		// 		attribute='data-theme'
		// 		defaultTheme='dark'
		// 		themes={daisyThemes.map((x) => x.name)}
		// 		enableColorScheme
		// 	>
		// 		<Story />
		// 	</ThemeProvider>
		// ),
		withThemeByDataAttribute({
			themes: Object.fromEntries(daisyThemes.map((x) => [`${symbols[x.colorScheme]} ${x.name}`, x.name])),
			defaultTheme: `${symbols.dark} dark`,
			attributeName: 'data-theme',
		}),
	],
}

export default preview
