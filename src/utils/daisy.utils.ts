import _daisyThemes from 'daisyui/theme/object'
import * as R from 'remeda'
import type { OmitIndexSignature } from 'type-fest'
import { makeTypeGuard } from './type.utils'

export type DaisyThemeName = keyof OmitIndexSignature<typeof _daisyThemes>
export type DaisyTheme = (typeof _daisyThemes)[DaisyThemeName]
export type DaisyThemeColor = {
	[K in keyof DaisyTheme]: K extends `--color-${infer Color}` ? Color : never
}[keyof DaisyTheme]

export const daisyThemes = R.pipe(
	_daisyThemes,
	R.entries(),
	R.map(([name, theme]) => ({
		name: name as DaisyThemeName,
		colorScheme: theme['color-scheme'] as 'dark' | 'light',
		theme: { ...theme },
	})),
	R.sortBy((x) => x.name !== 'light' && x.name !== 'dark', R.prop('colorScheme'), R.prop('name')),
)

export const daisyThemeMap = new Map(daisyThemes.map((x) => [x.name, x]))

export const daisyThemeNames = daisyThemes.map((x) => x.name)
export const isDaisyThemeName = makeTypeGuard(daisyThemeNames)

export const daisyThemeColors = R.keys(_daisyThemes.dark)
	.filter((key) => key.startsWith('--color-'))
	.map((key) => key.replace('--color-', '')) as DaisyThemeColor[]
export const isDaisyThemeColor = makeTypeGuard(daisyThemeColors)
