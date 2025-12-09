import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import type { JSXElementConstructor, ReactElement, ReactNode } from 'react'
import React from 'react'
import { twMerge } from 'tailwind-merge'

export * from './ascii'
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

export const nest = <P>(n: number, el: ReactElement<P>): ReactElement<P> => {
	if (n <= 1) return el
	const { type, props } = el
	let c: ReactNode = (props as { children?: ReactNode }).children
	const T = type as JSXElementConstructor<P>
	for (let d = 0; d < n; d++) c = React.createElement(T, props, c)
	return c as ReactElement<P>
}
