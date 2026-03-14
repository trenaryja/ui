import { DATE_TS_KEY, minGap } from '../charts.utils'

export const getBarRadius = (
	series: { stackId?: number | string; radius?: number }[],
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

	const half = minGap(sorted) / 2
	return [sorted[0] - half, sorted[sorted.length - 1] + half]
}

type BarAxisOptions = {
	layout: 'horizontal' | 'vertical'
	domainKey: string
	isDate: boolean
	timestamps?: number[]
	domainFormat?: (v: any) => string
	rangeFormat?: (v: number) => string
	rangeDomain?: [number | 'auto' | 'dataMin', number | 'auto' | 'dataMax']
}

export const resolveBarSize = (
	barSize: number | string | undefined,
	{ isDate, containerWidth, dataLength }: { isDate: boolean; containerWidth: number; dataLength: number },
) => (isDate && containerWidth > 0 ? Math.max(1, (containerWidth / dataLength) * 0.75) : barSize)

export const getBarAxisProps = ({
	layout,
	domainKey,
	isDate,
	timestamps,
	domainFormat,
	rangeFormat,
	rangeDomain,
}: BarAxisOptions) => {
	const xAxisDataKey = isDate ? DATE_TS_KEY : domainKey
	const dateProps =
		isDate && timestamps
			? { type: 'number' as const, scale: 'time' as const, domain: getDateBarDomain(timestamps) }
			: {}

	if (layout === 'vertical') {
		return {
			xAxisDataKey,
			xAxisProps: { type: 'number' as const, tickFormatter: rangeFormat, domain: rangeDomain },
			yAxisProps: { dataKey: domainKey, type: 'category' as const, tickFormatter: domainFormat },
		}
	}

	return {
		xAxisDataKey,
		xAxisProps: { dataKey: xAxisDataKey, tickFormatter: domainFormat, ...dateProps },
		yAxisProps: { tickFormatter: rangeFormat, domain: rangeDomain },
	}
}
