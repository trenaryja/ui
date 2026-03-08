import type { ReactNode } from 'react'
import { resolveColor } from '../charts.utils'
import { TooltipContent } from '../ChartTooltip'
import type { RadarTooltipProps } from '../charts.types'
import type { RadarSeries } from './RadarChart.types'

export const normalizeRadarSeries = <T extends Record<string, unknown>>(
	s: RadarSeries<T>,
	i: number,
	{ total, colors }: { total: number; colors?: string[] },
) => ({
	...s,
	color: s.color ?? resolveColor(i, total, colors),
	fill: s.fill ?? 'gradient',
})

export const renderRadarTooltipContent = ({ active, label, payload }: RadarTooltipProps): ReactNode | null => {
	if (!active || !payload?.length) return null
	const multi = payload.length > 1
	return (
		<TooltipContent
			title={label}
			showSwatch={multi}
			series={payload.map((entry) => ({
				key: String(entry.name),
				color: entry.color,
				label: multi ? String(entry.name) : undefined,
				value: entry.value,
			}))}
		/>
	)
}
