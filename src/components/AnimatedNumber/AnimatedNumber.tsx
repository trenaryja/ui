/* eslint-disable @eslint-react/no-array-index-key */

import { cn } from '@/utils'
import type { ComponentProps } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { AnimationTiming, DigitsConfig, FormattedSegment } from './AnimatedNumber.types'
import { digitRange, parseFormattedNumber, resolveTiming } from './AnimatedNumber.utils'

export type AnimatedNumberProps = ComponentProps<'span'> & {
	value: number
	prefix?: string
	suffix?: string
	format?: Intl.NumberFormatOptions
	locales?: Intl.LocalesArgument
	transformTiming?: AnimationTiming
	spinTiming?: AnimationTiming
	trend?: 'auto' | 'down' | 'up'
	animated?: boolean
	continuous?: boolean
	digits?: DigitsConfig
}

const Digit = ({
	digit,
	trend,
	duration,
	easing,
	delay,
	animated,
	max = 9,
}: {
	digit: number
	trend: 'down' | 'up'
	duration: number
	easing: string
	delay: number
	animated: boolean
	max?: number
}) => {
	const range = digitRange(max)
	const n = digit > max ? digit % (max + 1) : digit
	const offset = trend === 'down' ? n + range.length : n

	return (
		<span className='inline-block h-[1em] overflow-hidden' aria-hidden='true'>
			<span
				className={cn('flex flex-col', animated && 'transition-transform motion-reduce:transition-none')}
				style={{
					transform: `translateY(${-offset}em)`,
					transitionDuration: animated ? `${duration}ms` : undefined,
					transitionTimingFunction: animated ? easing : undefined,
					transitionDelay: delay > 0 && animated ? `${delay}ms` : undefined,
				}}
			>
				{[...range, ...range].map((d, i) => (
					<span key={i} className='h-[1em] leading-[1em]'>
						{d}
					</span>
				))}
			</span>
		</span>
	)
}

const easeOut = (t: number) => 1 - (1 - t) ** 3

export const AnimatedNumber = ({
	value,
	prefix,
	suffix,
	format,
	locales,
	transformTiming,
	spinTiming,
	trend: trendProp = 'auto',
	animated = true,
	continuous = false,
	digits,
	className,
	...props
}: AnimatedNumberProps) => {
	const [prevValue, setPrevValue] = useState<number>()
	const [displayValue, setDisplayValue] = useState(value)
	const rafRef = useRef<number | undefined>(undefined)
	const startRef = useRef({ time: 0, value })

	const timing = resolveTiming(transformTiming, spinTiming)
	const trend = trendProp === 'auto' ? (prevValue === undefined || value >= prevValue ? 'up' : 'down') : trendProp

	useEffect(() => {
		if (!continuous || !animated) {
			setDisplayValue(value)
			return
		}
		if (rafRef.current) cancelAnimationFrame(rafRef.current)

		const animate = (ts: number) => {
			if (!startRef.current.time) startRef.current = { time: ts, value: displayValue }
			const progress = Math.min((ts - startRef.current.time) / timing.duration, 1)
			setDisplayValue(Math.round(startRef.current.value + (value - startRef.current.value) * easeOut(progress)))
			if (progress < 1) rafRef.current = requestAnimationFrame(animate)
			else startRef.current.time = 0
		}

		rafRef.current = requestAnimationFrame(animate)
		return () => void (rafRef.current && cancelAnimationFrame(rafRef.current))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [value, continuous, animated, timing.duration])

	useEffect(() => setPrevValue(value), [value])

	const segments = parseFormattedNumber(displayValue, locales, format)
	const shouldAnimate = animated && prevValue !== undefined && !continuous
	const formatted = format || locales ? new Intl.NumberFormat(locales, format).format(value) : String(value)

	const renderSegment = (seg: FormattedSegment, i: number) =>
		seg.type === 'digit' ? (
			<Digit
				key={i}
				digit={seg.value}
				trend={trend}
				{...timing}
				animated={shouldAnimate}
				max={digits?.[seg.position]?.max}
			/>
		) : (
			<span key={i}>{seg.value}</span>
		)

	return (
		<span className={cn('inline-flex items-baseline tabular-nums', className)} {...props}>
			<span className='sr-only'>{`${prefix ?? ''}${formatted}${suffix ?? ''}`}</span>
			<span aria-hidden='true' className='inline-flex items-baseline'>
				{prefix}
				{segments.map(renderSegment)}
				{suffix}
			</span>
		</span>
	)
}
