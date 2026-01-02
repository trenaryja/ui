import { useCallback, useEffect, useMemo, useState } from 'react'
import * as R from 'remeda'
import defaultTheme from 'tailwindcss/defaultTheme'

type Breakpoints = Readonly<Record<string, string>>

type DefaultBreakpoints = typeof defaultTheme.screens

type BreakpointName<T extends Breakpoints | undefined> =
	| (undefined extends T ? keyof DefaultBreakpoints : keyof NonNullable<T>)
	| 'base'

type NormalizedBreakpoints<T extends Breakpoints | undefined> = Record<BreakpointName<T>, string>

export const useBreakpoint = <const T extends Breakpoints = DefaultBreakpoints>(breakpoints?: T) => {
	const [currentBreakpoint, setCurrentBreakpoint] = useState<BreakpointName<T>>('base')

	const normalized = useMemo(
		() =>
			(breakpoints
				? { base: '0rem', ...breakpoints }
				: { base: '0rem', ...defaultTheme.screens }) as NormalizedBreakpoints<T>,
		[breakpoints],
	)

	const sorted = useMemo(
		() => R.entries(normalized).sort(([, a], [, b]) => Number.parseFloat(a) - Number.parseFloat(b)),
		[normalized],
	)

	const ranked = useMemo(() => {
		const m = new Map<BreakpointName<T>, number>()
		sorted.forEach(([name], i) => m.set(name as BreakpointName<T>, i))
		return m
	}, [sorted])

	useEffect(() => {
		if (typeof window === 'undefined') return
		const queries = sorted.map(([, min]) => window.matchMedia(`(min-width: ${min})`))

		const read = () => {
			const i = queries.findLastIndex((q) => q.matches)
			const next = (i === -1 ? 'base' : sorted[i][0]) as BreakpointName<T>
			setCurrentBreakpoint((prev) => (prev === next ? prev : next))
		}

		for (const q of queries) q.addEventListener('change', read)
		read()

		return () => {
			for (const q of queries) q.removeEventListener('change', read)
		}
	}, [sorted])

	const isAtLeast = useCallback(
		(name: BreakpointName<T>) => {
			const a = ranked.get(currentBreakpoint)
			const b = ranked.get(name)
			return a !== undefined && b !== undefined && a >= b
		},
		[currentBreakpoint, ranked],
	)

	const isBelow = useCallback(
		(name: BreakpointName<T>) => {
			const a = ranked.get(currentBreakpoint)
			const b = ranked.get(name)
			return a !== undefined && b !== undefined && a < b
		},
		[currentBreakpoint, ranked],
	)

	return {
		breakpoint: currentBreakpoint,
		breakpoints: normalized,
		isAtLeast,
		isBelow,
	}
}
