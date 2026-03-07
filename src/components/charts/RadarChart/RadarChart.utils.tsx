import type { ReactNode } from 'react'
import { getChartColor } from '../charts.utils'
import type { FillType } from '../charts.types'
import type { RadarSeries } from './RadarChart.types'

export const normalizeRadarSeries = <T extends Record<string, unknown>>(s: RadarSeries<T>, i: number) => ({
	...s,
	color: s.color ?? getChartColor(i),
	fill: s.fill ?? ('gradient' as FillType),
})

type RadarTooltipProps = { active?: boolean; payload?: { name?: unknown; value?: unknown; color?: string }[] }

export const renderRadarTooltipContent = ({ active, payload }: RadarTooltipProps): ReactNode | null => {
	if (!active || !payload?.length) return null
	return (
		<div className='bg-base-300 px-3 py-2 rounded-lg shadow-lg'>
			{payload.map((entry) => (
				<p key={String(entry.name)} className='font-bold' style={{ color: entry.color }}>
					{entry.name as string}: {entry.value as number}
				</p>
			))}
		</div>
	)
}
