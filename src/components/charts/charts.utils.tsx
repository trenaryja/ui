'use client'

import { cn, css } from '@/utils'
import { format } from 'date-fns'
import type { ComponentProps, ReactNode } from 'react'
import type { Brush, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ResponsiveContainer } from 'recharts'
import type { ChartCssVars, ChartTooltipProps } from './charts.types'

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

export const toDateData = <TData extends Record<string, unknown>>(
	data: TData[],
	domainKey: string & keyof TData,
): (Record<typeof DATE_TS_KEY, number> & TData)[] =>
	data.map((d) => ({ ...d, [DATE_TS_KEY]: new Date(d[domainKey] as string).getTime() }))

export const resolveDateData = <TData extends Record<string, unknown>>(
	data: TData[],
	domainKey: string & keyof TData,
	isDate: boolean,
) => {
	if (!isDate) return { chartData: data, timestamps: undefined }
	const chartData = toDateData(data, domainKey)
	const timestamps = chartData.map((d) => d[DATE_TS_KEY]).sort((a, b) => a - b)
	return { chartData, timestamps }
}

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

export const getXFormatters = (
	domainType: string | undefined,
	formatters?: { domainTick?: (v: number | string) => string; tooltip?: { title?: (v: ReactNode) => ReactNode } },
	timestamps?: number[],
) => {
	if (domainType === 'date') {
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

		return {
			formatX: formatters?.domainTick ? (formatters.domainTick as (v: any) => string) : defaultFmt,
			formatXFull: fullFmt,
		}
	}

	return { formatX: formatters?.domainTick as ((v: any) => string) | undefined, formatXFull: undefined }
}

export const getClickProps = <TData,>(data: readonly TData[], fn?: (data: TData, index: number) => void) => {
	if (!fn) return undefined

	const handler = (e: Record<string, unknown>) => {
		const index = Number(e?.activeTooltipIndex ?? -1)
		if (index >= 0 && index < data.length) fn(data[index], index)
	}

	return { onMouseDown: handler, onTouchStart: handler }
}

export const defaultAxisProps: ComponentProps<typeof XAxis> & ComponentProps<typeof YAxis> = {
	stroke: 'currentColor',
	opacity: 0.5,
	fontSize: '.75rem',
	tickLine: false,
}

export const defaultBrushProps: Omit<ComponentProps<typeof Brush>, 'dataKey'> = {
	height: 20,
	stroke: 'currentColor',
	fill: 'transparent',
	tickFormatter: () => '',
}

export const defaultGridProps: ComponentProps<typeof CartesianGrid> = {
	stroke: 'currentColor',
	opacity: 0.1,
}

type BrushRangeDomainOptions = {
	brushOptions: { lockRange?: boolean } | undefined
	chartData: Record<string, unknown>[]
	seriesKeys: string[]
	rangeDomain: [number | 'auto' | 'dataMin', number | 'auto' | 'dataMax'] | undefined
}

export const resolveBrushRangeDomain = ({
	brushOptions,
	chartData,
	seriesKeys,
	rangeDomain,
}: BrushRangeDomainOptions): [number | 'auto' | 'dataMin', number | 'auto' | 'dataMax'] | undefined => {
	if (!brushOptions?.lockRange) return rangeDomain
	const max = Math.max(...chartData.flatMap((d) => seriesKeys.map((k) => Number(d[k] ?? 0))))
	return [0, max]
}

export const colorizeData = <TData extends Record<string, unknown>>(
	data: TData[],
	colors?: string[],
): (TData & { fill: string })[] => data.map((item, i) => ({ ...item, fill: resolveColor(i, data.length, colors) }))

export const normalizeSeries = <TSeries extends { key: string }>(
	series: TSeries[] | undefined,
	rangeKey: string | undefined,
	defaults?: Partial<Omit<TSeries, 'key'>>,
): TSeries[] => series ?? (rangeKey ? [{ key: rangeKey, ...defaults } as TSeries] : [])

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

export const makeTooltipResolver = <T extends { key: string; color: string; name: string }>(
	seriesWithColors: T[],
	formatXFull: ((v: any) => string) | undefined,
	opts?: { valueLabel?: string; makeSwatch?: (s: T) => ReactNode },
) => {
	const { valueLabel, makeSwatch } = opts ?? {}
	const multi = seriesWithColors.length > 1

	return ({ active, payload, label }: ChartTooltipProps) => {
		if (!active || !payload?.length) return null
		return {
			title: formatXFull && label != null ? formatXFull(label) : label,
			items: payload.map((entry) => {
				const s = seriesWithColors.find((x) => x.key === entry.dataKey)
				const { value } = entry
				return {
					key: entry.dataKey ?? '',
					color: multi ? (s?.color ?? entry.color) : undefined,
					swatch: multi && s && makeSwatch ? makeSwatch(s) : undefined,
					label: multi ? s?.name : undefined,
					value: valueLabel ? `${value} ${valueLabel}${value !== 1 ? 's' : ''}` : value,
				}
			}),
		}
	}
}

/** Extract custom components from a slot value, filtering out booleans. */
export const slotComponents = <T,>(slot: boolean | T | undefined): T | undefined =>
	typeof slot === 'boolean' || slot == null ? undefined : slot

export const getAreaFill = (fill: string, color: string, gradientId: string) => {
	if (fill === 'gradient') return `url(#${gradientId})`
	if (fill === 'solid') return color
	return 'none'
}
