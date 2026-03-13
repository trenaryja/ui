import { resolveColor } from '../charts.utils'
import type { RadarChartProps } from './RadarChart'

export const normalizeRadarSeries = <T extends Record<string, unknown>>(
	s: NonNullable<RadarChartProps<T>['series']>[number],
	i: number,
	{ total, colors }: { total: number; colors?: string[] },
) => ({
	...s,
	color: s.color ?? resolveColor(i, total, colors),
	fill: s.fill ?? 'gradient',
})
