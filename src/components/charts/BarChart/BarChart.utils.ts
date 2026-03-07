import { DATE_TS_KEY, getChartColor, resolveBrushYDomain } from '../charts.utils'
import type { BarSeries } from './BarChart.types'

export const resolveBarSeries = <T extends Record<string, unknown>>(
	series: BarSeries<T>[] | undefined,
	yKey: (string & keyof T) | undefined,
	valueLabel: string | undefined,
): BarSeries<T>[] => series ?? (yKey ? [{ key: yKey, label: valueLabel }] : [])

export const normalizeBarSeries =
	<T extends Record<string, unknown>>(stacked: boolean | undefined) =>
	(s: BarSeries<T>, i: number) => ({
		...s,
		name: s.label ?? s.key,
		color: s.color ?? getChartColor(i),
		stackId: stacked && !s.stackId ? 'stack' : s.stackId,
	})

export const buildLastPerStack = (series: { stackId: string | undefined }[]) => {
	const map = new Map<string | undefined, number>()
	series.forEach((s, i) => map.set(s.stackId, i))
	return map
}

export const getBarRadius = (
	radius: number | undefined,
	stacked: boolean | undefined,
	{ isLast, layout }: { isLast: boolean; layout: 'horizontal' | 'vertical' },
): [number, number, number, number] => {
	const r = radius ?? 4
	const rounded: [number, number, number, number] = layout === 'vertical' ? [0, r, r, 0] : [r, r, 0, 0]
	if (!stacked) return rounded
	return isLast ? rounded : [0, 0, 0, 0]
}

export const getDateBarDomain = (chartData: Record<string, unknown>[]): [number, number] => {
	const timestamps = chartData
		.map((d) => d[DATE_TS_KEY] as number)
		.filter(Number.isFinite)
		.sort((a, b) => a - b)
	if (timestamps.length === 0) return [0, 0]
	if (timestamps.length === 1) {
		const half = 43200000 // 12 hours
		return [timestamps[0] - half, timestamps[0] + half]
	}

	let minInterval = Infinity

	for (let i = 1; i < timestamps.length; i++) {
		minInterval = Math.min(minInterval, timestamps[i] - timestamps[i - 1])
	}

	const half = minInterval / 2
	return [timestamps[0] - half, timestamps[timestamps.length - 1] + half]
}

export const getResolvedBarSize = (opts: {
	isDate: boolean
	containerWidth: number
	dataLength: number
	barSize: number | undefined
}) => {
	if (!opts.isDate || opts.containerWidth <= 0) return opts.barSize
	return Math.max(1, (opts.containerWidth / opts.dataLength) * 0.8)
}

type AnyFormatter = (v: any) => string

type BarAxisOptions = {
	layout: 'horizontal' | 'vertical'
	xKey: string
	isDate: boolean
	chartData: Record<string, unknown>[]
	formatX?: AnyFormatter
	yFormat?: (v: number) => string
	yDomain?: [number | 'auto' | 'dataMin', number | 'auto' | 'dataMax']
	brushOptions?: { lockYAxis?: boolean }
	seriesKeys?: string[]
}

export const getBarAxisProps = ({
	layout,
	xKey,
	isDate,
	chartData,
	formatX,
	yFormat,
	yDomain,
	brushOptions,
	seriesKeys,
}: BarAxisOptions) => {
	const xAxisDataKey = isDate ? DATE_TS_KEY : xKey
	const dateProps = isDate
		? { type: 'number' as const, scale: 'time' as const, domain: getDateBarDomain(chartData) }
		: {}
	const resolvedYDomain =
		layout === 'horizontal' && seriesKeys
			? resolveBrushYDomain({ brushOptions, chartData, seriesKeys, yDomain })
			: yDomain
	return {
		xAxisDataKey,
		xAxisProps:
			layout === 'horizontal'
				? { dataKey: xAxisDataKey, tickFormatter: formatX, ...dateProps }
				: { type: 'number' as const, tickFormatter: yFormat, domain: resolvedYDomain },
		yAxisProps:
			layout === 'horizontal'
				? { tickFormatter: yFormat, domain: resolvedYDomain }
				: { dataKey: xKey, type: 'category' as const, tickFormatter: formatX },
	}
}
