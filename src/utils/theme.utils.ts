import chroma from 'chroma-js'
import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
	const classes = twMerge(clsx(inputs)).split(/\s+/)
	const lastReset = classes.lastIndexOf('reset')
	const result = lastReset === -1 ? classes : classes.slice(lastReset + 1)
	return result.join(' ')
}

export const addOpacityToOklch = (oklch: string | undefined, opacity: number) =>
	`${oklch?.split(')')[0]} / ${opacity / 100})`

export const isDark = (color: string) => {
	const c = chroma(color)
	if (!chroma.valid(c)) return false
	const contrastW = chroma.contrast(c, '#fff')
	const contrastB = chroma.contrast(c, '#000')
	return contrastW > contrastB
}
