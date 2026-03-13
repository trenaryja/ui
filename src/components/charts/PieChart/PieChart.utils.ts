import type { PieChartProps } from './PieChart'

type PieSeries<T extends Record<string, unknown>> = NonNullable<PieChartProps<T>['series']>[number]

export const normalizePieSeries = <T extends Record<string, unknown>>(
	series: PieSeries<T>[] | undefined,
	shorthand: Partial<PieSeries<T>>,
): PieSeries<T>[] => {
	if (series) return series
	const { valueKey, nameKey } = shorthand
	if (valueKey && nameKey) return [{ ...shorthand, valueKey, nameKey }]
	return []
}
