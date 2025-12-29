import _daisyThemes from 'daisyui/theme/object'
import * as R from 'remeda'
import type { OmitIndexSignature } from 'type-fest'

export type DaisyThemeName = keyof OmitIndexSignature<typeof _daisyThemes>
export type DaisyTheme = (typeof _daisyThemes)[DaisyThemeName]
export type DaisyThemeColor = {
	[K in keyof DaisyTheme]: K extends `--color-${infer Color}` ? Color : never
}[keyof DaisyTheme]

export const daisyThemeColors = R.keys(_daisyThemes.dark)
	.filter((key) => key.startsWith('--color-'))
	.map((key) => key.replace('--color-', '')) as DaisyThemeColor[]

export const daisyThemes = R.pipe(
	_daisyThemes,
	R.entries(),
	R.map(([name, theme]) => ({
		name: name as DaisyThemeName,
		colorScheme: theme['color-scheme'] as 'dark' | 'light',
	})),
	R.sortBy((x) => x.name !== 'light' && x.name !== 'dark', R.prop('colorScheme'), R.prop('name')),
)
