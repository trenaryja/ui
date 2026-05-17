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

export type FunctionalClassName<T> = ((val: T) => string | undefined) | string | undefined

export const cnFn = <T>(className: FunctionalClassName<T>, value: T) =>
	typeof className === 'string' ? className : className?.(value)
