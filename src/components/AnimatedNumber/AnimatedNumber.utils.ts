import type { AnimationTiming, FormattedSegment, ResolvedTiming } from './AnimatedNumber.types'

const DEFAULT: ResolvedTiming = { duration: 1000, easing: 'ease-out', delay: 0 }

export const resolveTiming = (transform?: AnimationTiming, spin?: AnimationTiming): ResolvedTiming => {
	const base = { ...DEFAULT, ...transform }
	return { ...base, ...spin }
}

export const parseFormattedNumber = (
	value: number,
	locales?: Intl.LocalesArgument,
	format?: Intl.NumberFormatOptions,
): FormattedSegment[] => {
	const parts = new Intl.NumberFormat(locales, format).formatToParts(Math.abs(value))
	const segments: FormattedSegment[] = value < 0 ? [{ type: 'static', value: '-' }] : []
	const integerCount = parts.filter((p) => p.type === 'integer').reduce((sum, p) => sum + p.value.length, 0)

	let intIdx = 0
	let fracIdx = 0

	for (const { type, value: v } of parts) {
		if (type === 'integer') {
			for (const char of v) segments.push({ type: 'digit', value: Number(char), position: integerCount - 1 - intIdx++ })
		} else if (type === 'fraction') {
			for (const char of v) segments.push({ type: 'digit', value: Number(char), position: -++fracIdx })
		} else {
			segments.push({ type: 'static', value: v })
		}
	}

	return segments
}

export const digitRange = (max = 9) => Array.from({ length: max + 1 }, (_, i) => i)
