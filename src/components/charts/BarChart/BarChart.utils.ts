import { DATE_TS_KEY, resolveColor } from '../charts.utils'
import type { BarSeries } from './BarChart.types'

export const resolveBarSeries = <T extends Record<string, unknown>>(
	series: BarSeries<T>[] | undefined,
	yKey: (string & keyof T) | undefined,
	valueLabel: string | undefined,
): BarSeries<T>[] => series ?? (yKey ? [{ key: yKey, label: valueLabel }] : [])

export const normalizeBarSeries = <T extends Record<string, unknown>>(
	s: BarSeries<T>,
	i: number,
	{ stacked, total, colors }: { stacked?: boolean; total: number; colors?: string[] },
) => ({
	...s,
	name: s.label ?? s.key,
	color: s.color ?? resolveColor(i, total, colors),
	stackId: stacked && !s.stackId ? 'stack' : s.stackId,
})

export const getBarRadius = (
	series: { stackId?: string; radius?: number }[],
	index: number,
	{ stacked, layout }: { stacked?: boolean; layout: 'horizontal' | 'vertical' },
): [number, number, number, number] => {
	const r = series[index].radius ?? 4
	const rounded: [number, number, number, number] = layout === 'vertical' ? [0, r, r, 0] : [r, r, 0, 0]
	if (!stacked) return rounded
	const isLast = series.findLastIndex((s) => s.stackId === series[index].stackId) === index
	return isLast ? rounded : [0, 0, 0, 0]
}

const getDateBarDomain = (sorted: number[]): [number, number] => {
	if (sorted.length === 0) return [0, 0]
	if (sorted.length === 1) {
		const half = 3_600_000 // 1 hour
		return [sorted[0] - half, sorted[0] + half]
	}

	let minInterval = Infinity
	for (let i = 1; i < sorted.length; i++) minInterval = Math.min(minInterval, sorted[i] - sorted[i - 1])

	const half = minInterval / 2
	return [sorted[0] - half, sorted[sorted.length - 1] + half]
}

type BarAxisOptions = {
	layout: 'horizontal' | 'vertical'
	xKey: string
	isDate: boolean
	timestamps?: number[]
	xFormat?: (v: any) => string
	yFormat?: (v: number) => string
	yDomain?: [number | 'auto' | 'dataMin', number | 'auto' | 'dataMax']
}

export const getBarAxisProps = ({ layout, xKey, isDate, timestamps, xFormat, yFormat, yDomain }: BarAxisOptions) => {
	const xAxisDataKey = isDate ? DATE_TS_KEY : xKey
	const dateProps =
		isDate && timestamps
			? { type: 'number' as const, scale: 'time' as const, domain: getDateBarDomain(timestamps) }
			: {}

	if (layout === 'vertical') {
		return {
			xAxisDataKey,
			xAxisProps: { type: 'number' as const, tickFormatter: yFormat, domain: yDomain },
			yAxisProps: { dataKey: xKey, type: 'category' as const, tickFormatter: xFormat },
		}
	}

	return {
		xAxisDataKey,
		xAxisProps: { dataKey: xAxisDataKey, tickFormatter: xFormat, ...dateProps },
		yAxisProps: { tickFormatter: yFormat, domain: yDomain },
	}
}
