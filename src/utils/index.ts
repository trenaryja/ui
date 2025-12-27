import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export * from './ascii.utils'
export * from './color.utils'
export * from './date.utils'

export const cn = (...inputs: ClassValue[]) => {
	const classes = twMerge(clsx(inputs)).split(/\s+/)
	const lastReset = classes.lastIndexOf('reset')
	const result = lastReset === -1 ? classes : classes.slice(lastReset + 1)
	return result.join(' ')
}

export const formatUSD = (value?: number, showCents = false, options?: Intl.NumberFormatOptions) => {
	const formatter = new Intl.NumberFormat(undefined, {
		style: 'currency',
		currency: 'USD',
		minimumFractionDigits: showCents ? 2 : 0,
		maximumFractionDigits: showCents ? 2 : 0,
		...options,
	})

	return formatter.format(value ?? 0)
}

export const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
export const lcm = (a: number, b: number): number => (a * b) / gcd(a, b)

export const tryIgnore = (fn: () => void) => {
	try {
		fn()
	} catch {
		// ignore
	}
}

export const tryOr = <T>(fn: () => T, fallback: T) => {
	try {
		return fn()
	} catch {
		return fallback
	}
}

export const tryElse = <T>(fn: () => T, fallback: (error: unknown) => T) => {
	try {
		return fn()
	} catch (error: unknown) {
		return fallback(error)
	}
}
