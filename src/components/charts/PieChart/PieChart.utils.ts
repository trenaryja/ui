import type { PieChartProps } from './PieChart'

type PieSeries<TData extends Record<string, unknown>> = NonNullable<PieChartProps<TData>['series']>[number]

export const normalizePieSeries = <TData extends Record<string, unknown>>(
	series: PieSeries<TData>[] | undefined,
	shorthand: Partial<PieSeries<TData>>,
): PieSeries<TData>[] => {
	if (series) return series
	const { valueKey, nameKey } = shorthand
	if (valueKey && nameKey) return [{ ...shorthand, valueKey, nameKey }]
	return []
}
