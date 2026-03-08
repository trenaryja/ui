'use client'

import { cn, css } from '@/utils'
import { format, parseISO } from 'date-fns'
import type { ComponentProps } from 'react'
import { ReferenceArea, ReferenceLine, ResponsiveContainer } from 'recharts'
import type { ChartCssVars, ReferenceAreaConfig, ReferenceLineConfig } from './charts.types'

const DEFAULT_COLORS = [
	'var(--color-base-content)',
	'var(--color-primary)',
	'var(--color-secondary)',
	'var(--color-accent)',
]

export const resolveColor = (i: number, total: number, colors?: string[]): string => {
	const stops = colors?.length ? colors : DEFAULT_COLORS
	if (stops.length === 1) return stops[0]
	if (stops.length >= total) return stops[i]
	const t = total <= 1 ? 0 : i / (total - 1)
	const segCount = stops.length - 1
	const seg = Math.min(Math.floor(t * segCount), segCount - 1)
	const localT = t * segCount - seg
	const pct = Math.round((1 - localT) * 100)
	return `color-mix(in oklch, ${stops[seg]} ${pct}%, ${stops[seg + 1]})`
}

export const DATE_TS_KEY = '__xTs' as const

export const toDateData = <T extends Record<string, unknown>>(
	data: T[],
	xKey: string & keyof T,
): (Record<typeof DATE_TS_KEY, number> & T)[] =>
	data.map((d) => ({ ...d, [DATE_TS_KEY]: new Date(d[xKey] as string).getTime() }))

export const resolveDateData = <T extends Record<string, unknown>>(
	data: T[],
	xKey: string & keyof T,
	isDate: boolean,
) => {
	if (!isDate) return { chartData: data, timestamps: undefined }
	const chartData = toDateData(data, xKey)
	const timestamps = chartData.map((d) => d[DATE_TS_KEY]).sort((a, b) => a - b)
	return { chartData, timestamps }
}

export const formatDate = (v: string) => format(parseISO(v), 'MMM d')
export const formatDateFull = (v: string) => format(parseISO(v), 'MMM d, yyyy')

type ChartContainerProps = Omit<ComponentProps<typeof ResponsiveContainer>, 'className' | 'minWidth' | 'style'> & {
	className?: string
	cssVars?: ChartCssVars
}

export const ChartContainer = ({ className, cssVars, ...props }: ChartContainerProps) => (
	<ResponsiveContainer {...props} className={cn('chart', className)} style={css({ ...cssVars })} minWidth={0} />
)

export const getXFormatters = (xType: string | undefined, xFormat?: (v: string) => string, timestamps?: number[]) => {
	if (xType === 'date') {
		let minInterval = Infinity
		if (timestamps)
			for (let i = 1; i < timestamps.length; i++) minInterval = Math.min(minInterval, timestamps[i] - timestamps[i - 1])
		const hasTime = minInterval < 86_400_000 // sub-daily resolution
		const span = timestamps?.length ? timestamps[timestamps.length - 1] - timestamps[0] : Infinity
		const multiDay = span >= 86_400_000

		const defaultFmt: (v: any) => string =
			hasTime && multiDay
				? (v: number) => format(new Date(v), 'MMM d, ha')
				: hasTime
					? (v: number) => format(new Date(v), 'h:mm a')
					: (v: number) => format(new Date(v), 'MMM d')

		const fullFmt: (v: any) => string = hasTime
			? (v: number) => format(new Date(v), 'MMM d, h:mm a')
			: (v: number) => format(new Date(v), 'MMM d, yyyy')

		return { formatX: xFormat ? (xFormat as (v: any) => string) : defaultFmt, formatXFull: fullFmt }
	}

	return { formatX: xFormat, formatXFull: undefined }
}

export const makeClickHandler =
	<T,>(fn: (data: T, index: number) => void) =>
	(e: Record<string, unknown>) => {
		const payload = e?.activePayload as { payload: T }[] | undefined
		if (payload?.[0]) fn(payload[0].payload, Number(e.activeTooltipIndex ?? 0))
	}

export const getClickHandler = <T,>(fn?: (data: T, index: number) => void) => (fn ? makeClickHandler(fn) : undefined)

export const axisProps = {
	stroke: 'currentColor',
	opacity: 0.5,
	fontSize: 12,
	tickLine: false,
	axisLine: false,
}

export const brushProps = {
	height: 20,
	stroke: 'currentColor',
	fill: 'transparent',
	tickFormatter: () => '',
}

export const renderRefAreas = (areas?: ReferenceAreaConfig[]) =>
	areas?.map((ra) => (
		<ReferenceArea
			key={`${ra.x1 ?? ''}-${ra.x2 ?? ''}-${ra.y1 ?? ''}-${ra.y2 ?? ''}`}
			x1={ra.x1}
			x2={ra.x2}
			y1={ra.y1}
			y2={ra.y2}
			label={ra.label}
			className={ra.className}
		/>
	))

export const renderRefLines = (lines?: ReferenceLineConfig[]) =>
	lines?.map((rl) => (
		<ReferenceLine
			key={`${rl.x ?? ''}-${rl.y ?? ''}`}
			x={rl.x}
			y={rl.y}
			label={rl.label}
			className={rl.className}
			stroke='currentColor'
			strokeDasharray='4 2'
			opacity={0.5}
		/>
	))

type BrushYDomainOptions = {
	brushOptions: { lockYAxis?: boolean } | undefined
	chartData: Record<string, unknown>[]
	seriesKeys: string[]
	yDomain: [number | 'auto' | 'dataMin', number | 'auto' | 'dataMax'] | undefined
}

export const resolveBrushYDomain = ({
	brushOptions,
	chartData,
	seriesKeys,
	yDomain,
}: BrushYDomainOptions): [number | 'auto' | 'dataMin', number | 'auto' | 'dataMax'] | undefined => {
	if (!brushOptions?.lockYAxis) return yDomain
	const max = Math.max(...chartData.flatMap((d) => seriesKeys.map((k) => Number(d[k] ?? 0))))
	return [0, max]
}
