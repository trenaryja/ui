'use client'

import { cn, css } from '@/utils'
import { format, parseISO } from 'date-fns'
import type { ComponentProps, ReactNode } from 'react'
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
	<ResponsiveContainer
		{...props}
		className={cn('chart', className)}
		style={css({ ...cssVars })}
		minWidth={0}
		initialDimension={{ width: 1, height: 1 }}
	/>
)

export const minGap = (sorted: number[]) =>
	sorted.reduce((min, v, i) => (i === 0 ? min : Math.min(min, v - sorted[i - 1])), Infinity)

export const getXFormatters = (xType: string | undefined, xFormat?: (v: string) => string, timestamps?: number[]) => {
	if (xType === 'date') {
		const minInterval = timestamps ? minGap(timestamps) : Infinity
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
	areas?.map((ra) => <ReferenceArea key={`${ra.x1 ?? ''}-${ra.x2 ?? ''}-${ra.y1 ?? ''}-${ra.y2 ?? ''}`} {...ra} />)

export const renderRefLines = (lines?: ReferenceLineConfig[]) =>
	lines?.map((rl) => <ReferenceLine key={`${rl.x ?? ''}-${rl.y ?? ''}`} strokeDasharray='4 2' opacity={0.5} {...rl} />)

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

export const colorizeData = <T extends Record<string, unknown>>(
	data: T[],
	colors?: string[],
): (T & { fill: string })[] => data.map((item, i) => ({ ...item, fill: resolveColor(i, data.length, colors) }))

export const normalizeSeries = <S extends { key: string }>(
	series: S[] | undefined,
	yKey: string | undefined,
	defaults?: Partial<Omit<S, 'key'>>,
): S[] => series ?? (yKey ? [{ key: yKey, ...defaults } as S] : [])

export const renderGradientDefs = (
	series: { fill: string; color: string; key: string }[],
	chartId: string,
): ReactNode => {
	if (!series.some((s) => s.fill === 'gradient')) return null
	return (
		<defs>
			{series.map((s, i) =>
				s.fill === 'gradient' ? (
					<linearGradient key={s.key} id={`${chartId}-gradient-${i}`} x1='0' y1='0' x2='0' y2='1'>
						<stop offset='5%' stopColor={s.color} stopOpacity={0.3} />
						<stop offset='95%' stopColor={s.color} stopOpacity={0} />
					</linearGradient>
				) : null,
			)}
		</defs>
	)
}

export const getAreaFill = (fill: string, color: string, gradientId: string) => {
	if (fill === 'gradient') return `url(#${gradientId})`
	if (fill === 'solid') return color
	return 'none'
}
