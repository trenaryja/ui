'use client'

import { cn } from '@/utils'
import { useId } from 'react'
import {
	Legend,
	PolarAngleAxis,
	PolarGrid,
	Radar,
	RadarChart as RechartsRadarChart,
	ResponsiveContainer,
} from 'recharts'
import { ChartEmpty, isChartEmpty, renderTooltip } from '../charts.utils'
import type { RadarChartProps, RadarSeries } from './RadarChart.types'
import { normalizeRadarSeries, renderRadarTooltipContent } from './RadarChart.utils'

export type { RadarChartProps, RadarSeries } from './RadarChart.types'

export const RadarChart = <T extends Record<string, unknown>>({
	data,
	angleKey,
	yKey,
	series,
	gridType = 'polygon',
	legend,
	tooltip = true,
	classNames,
	emptyMessage = 'No data available',
}: RadarChartProps<T>) => {
	const chartId = useId()
	const resolvedSeries: RadarSeries<T>[] = series ?? (yKey ? [{ key: yKey }] : [])
	const seriesWithColors = resolvedSeries.map(normalizeRadarSeries)

	if (isChartEmpty(data, resolvedSeries)) return <ChartEmpty message={emptyMessage} />

	return (
		<div className={cn('chart', classNames?.container)}>
			<ResponsiveContainer width='100%' height='100%' minWidth={0}>
				<RechartsRadarChart data={data}>
					<defs>
						{seriesWithColors.map((s, i) =>
							s.fill === 'gradient' ? (
								<linearGradient key={s.key} id={`${chartId}-gradient-${i}`} x1='0' y1='0' x2='0' y2='1'>
									<stop offset='5%' stopColor={s.color} stopOpacity={0.3} />
									<stop offset='95%' stopColor={s.color} stopOpacity={0.05} />
								</linearGradient>
							) : null,
						)}
					</defs>
					<PolarGrid gridType={gridType} stroke='currentColor' opacity={0.2} />
					<PolarAngleAxis dataKey={angleKey} stroke='currentColor' opacity={0.5} fontSize={12} />
					{renderTooltip(tooltip, renderRadarTooltipContent, classNames?.tooltip)}
					{legend && <Legend className={classNames?.legend} />}
					{seriesWithColors.map((s, i) => (
						<Radar
							key={s.key}
							dataKey={s.key}
							name={s.label ?? s.key}
							stroke={s.color}
							fill={s.fill === 'gradient' ? `url(#${chartId}-gradient-${i})` : s.fill === 'solid' ? s.color : 'none'}
							fillOpacity={1}
						/>
					))}
				</RechartsRadarChart>
			</ResponsiveContainer>
		</div>
	)
}
