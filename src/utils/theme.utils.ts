import chroma from 'chroma-js'
import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import type { CSSProperties } from 'react'
import * as R from 'remeda'
import { twMerge } from 'tailwind-merge'

export type CSSWithVars = CSSProperties & Record<`--${string}`, number | string | undefined>

export const css = (styles: CSSWithVars): CSSProperties => styles

export const cn = (...inputs: ClassValue[]) => {
	const classes = twMerge(clsx(inputs)).split(/\s+/)
	const lastReset = classes.lastIndexOf('reset')
	const result = lastReset === -1 ? classes : classes.slice(lastReset + 1)
	return result.join(' ')
}

export const cnFn = <T>(className: FunctionalClassName<T>, value: T) =>
	typeof className === 'string' ? className : className?.(value)
export type FunctionalClassName<T> = ((val: T) => string | undefined) | string | undefined

export type ColorMixSpace = 'hsl' | 'hwb' | 'lab' | 'lch' | 'oklab' | 'oklch' | 'srgb-linear' | 'srgb' | 'xyz'

export const colorMix = (opts: { color1: string; color2: string; ratio: number; colorSpace?: ColorMixSpace }) =>
	`color-mix(in ${opts.colorSpace ?? 'oklab'}, ${opts.color1} ${R.clamp(opts.ratio, { min: 0, max: 100 })}%, ${opts.color2})`

/** Interpolate between an array of color stops at position t (0–1). */
export const interpolateColors = (t: number, stops: string[], colorSpace?: ColorMixSpace): string => {
	if (stops.length === 1) return stops[0]
	const clamped = R.clamp(t, { min: 0, max: 1 })
	const segCount = stops.length - 1
	const seg = Math.min(Math.floor(clamped * segCount), segCount - 1)
	const localT = clamped * segCount - seg
	const pct = Math.round((1 - localT) * 100)
	return colorMix({ color1: stops[seg], color2: stops[seg + 1], ratio: pct, colorSpace: colorSpace ?? 'oklch' })
}

export const addOpacityToOklch = (oklch: string | undefined, opacity: number) =>
	`${oklch?.split(')')[0]} / ${opacity / 100})`

/** Integer luminance from RGB (BT.601 approximation: 0.21R + 0.72G + 0.07B) */
export const rgbToLuma = (r: number, g: number, b: number) => (54 * r + 184 * g + 18 * b) >> 8

export const isDark = (color: string) => {
	const c = chroma(color)
	if (!chroma.valid(c)) return false
	const contrastW = chroma.contrast(c, '#fff')
	const contrastB = chroma.contrast(c, '#000')
	return contrastW > contrastB
}
