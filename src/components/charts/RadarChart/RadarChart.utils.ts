import { resolveColor } from '../charts.utils'
import type { RadarChartProps } from './RadarChart'

export const normalizeRadarSeries = <TData extends Record<string, unknown>>(
	s: NonNullable<RadarChartProps<TData>['series']>[number],
	i: number,
	{ total, colors }: { total: number; colors?: string[] },
) => ({
	...s,
	color: s.color ?? resolveColor(i, total, colors),
	fill: s.fill ?? 'gradient',
})
