import chroma from 'chroma-js'
import * as R from 'remeda'
import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import type { CSSProperties } from 'react'
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

export const colorMix = (color1: string, color2: string, ratio: number) =>
	`color-mix(in oklab, ${color1} ${R.clamp(ratio, { min: 0, max: 100 })}%, ${color2})`

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
