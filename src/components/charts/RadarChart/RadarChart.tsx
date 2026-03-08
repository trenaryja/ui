'use client'

import { useId } from 'react'
import { Legend, PolarAngleAxis, PolarGrid, Radar, RadarChart as RechartsRadarChart } from 'recharts'
import { ChartContainer } from '../charts.utils'
import { chartTooltip } from '../ChartTooltip'
import type { RadarChartProps, RadarSeries } from './RadarChart.types'
import { normalizeRadarSeries, renderRadarTooltipContent } from './RadarChart.utils'

export type { RadarChartProps, RadarSeries } from './RadarChart.types'

export const RadarChart = <T extends Record<string, unknown>>({
	data,
	angleKey,
	yKey,
	series,
	colors,
	gridType = 'polygon',
	legend,
	tooltip = true,
	tooltipContent,
	className,
	classNames,
	cssVars,
}: RadarChartProps<T>) => {
	const chartId = useId()
	const resolvedSeries: RadarSeries<T>[] = series ?? (yKey ? [{ key: yKey }] : [])
	const seriesWithColors = resolvedSeries.map((s, i) =>
		normalizeRadarSeries(s, i, { total: resolvedSeries.length, colors }),
	)

	const tooltipEl = chartTooltip({
		tooltip,
		content: tooltipContent ?? renderRadarTooltipContent,
		className: classNames?.tooltip,
	})

	return (
		<ChartContainer className={className} cssVars={cssVars}>
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
				{/* eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion */}
				<PolarAngleAxis dataKey={angleKey as string} stroke='currentColor' opacity={0.5} fontSize={12} />
				{tooltipEl}
				{legend && <Legend className={classNames?.legend} />}
				{seriesWithColors.map((s, i) => (
					<Radar
						key={s.key}
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
						dataKey={s.key as string}
						name={s.label ?? s.key}
						stroke={s.color}
						fill={s.fill === 'gradient' ? `url(#${chartId}-gradient-${i})` : s.fill === 'solid' ? s.color : 'none'}
						fillOpacity={1}
					/>
				))}
			</RechartsRadarChart>
		</ChartContainer>
	)
}
