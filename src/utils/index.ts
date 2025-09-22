import { clsx, type ClassValue } from 'clsx'
import { cloneElement } from 'react'
import { twMerge } from 'tailwind-merge'

export * from './colors'

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

export const nest = (count: number, element: React.ReactElement) => {
	if (count <= 1) return element
	return [...Array(count - 1).keys()].reduce((acc, _, i) => cloneElement(element, { key: i }, acc), element)
}
