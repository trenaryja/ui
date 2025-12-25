import type { colors, palette } from '@/utils'
import daisyThemes from 'daisyui/theme/object'
import type { OmitIndexSignature } from 'type-fest'

export { daisyThemes }

export type Suggest<T, U> = (U & { __?: never }) | T

export type DaisyThemeName = keyof OmitIndexSignature<typeof daisyThemes>
export type DaisyTheme = (typeof daisyThemes)[DaisyThemeName]
export type DaisyThemeColor = {
	[K in keyof DaisyTheme]: K extends `--color-${infer Color}` ? Color : never
}[keyof DaisyTheme]

export type TailwindColorName = keyof typeof colors
export type TailwindShadeDictionary = (typeof colors)[TailwindColorName]
export type TailwindIndex = keyof TailwindShadeDictionary
export type TailwindColor = `${TailwindColorName}-${TailwindIndex}`
export type TailwindColorMeta = (typeof palette)[number]
