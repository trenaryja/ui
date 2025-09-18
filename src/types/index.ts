import daisyThemes from 'daisyui/theme/object'
import defaultTheme from 'tailwindcss/defaultTheme'
import { OmitIndexSignature } from 'type-fest'
import { colors, flatPalette } from '../utils'

export type Suggest<T, U> = T | (U & { __?: never })

export type ChromaColor = string | number | chroma.Color

export type DaisyThemeName = keyof OmitIndexSignature<typeof daisyThemes>
export type DaisyTheme = (typeof daisyThemes)[DaisyThemeName]
export type DaisyThemeColor = {
	[K in keyof DaisyTheme]: K extends `--color-${infer Color}` ? Color : never
}[keyof DaisyTheme]

export type TailwindBreakpointName = keyof typeof defaultTheme.screens
export type TailwindColorName = keyof typeof colors
export type TailwindShadeDictionary = (typeof colors)[TailwindColorName]
export type TailwindIndex = keyof TailwindShadeDictionary
export type TailwindColor = `${TailwindColorName}-${TailwindIndex}`
export type TailwindColorMeta = (typeof flatPalette)[number]
