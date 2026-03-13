'use client'

import { useId } from 'react'
import { PolarAngleAxis, PolarGrid, Radar, RadarChart as RechartsRadarChart } from 'recharts'
import { ChartLegend } from '../ChartLegend'
import type { ChartSeries, DeriveProps, FillType, PolarChartBaseProps, RadarTooltipProps } from '../charts.types'
import { ChartContainer, getAreaFill, normalizeSeries, renderGradientDefs } from '../charts.utils'
import { ChartTooltip } from '../ChartTooltip'
import { normalizeRadarSeries } from './RadarChart.utils'

export type RadarChartProps<T extends Record<string, unknown>> = PolarChartBaseProps<
	T,
	RadarTooltipProps,
	typeof RechartsRadarChart
> & {
	angleKey: string & keyof T
	yKey?: string & keyof T
	series?: (ChartSeries<T> &
		DeriveProps<typeof Radar, 'dataKey'> & {
			fill?: FillType
		})[]
	subProps?: {
		radar?: DeriveProps<typeof Radar, 'dataKey'>
		polarGrid?: DeriveProps<typeof PolarGrid>
		polarAngleAxis?: DeriveProps<typeof PolarAngleAxis, 'dataKey'>
	}
}

export const RadarChart = <T extends Record<string, unknown>>({
	data,
	angleKey,
	yKey,
	series,
	colors,
	subProps,
	legend,
	legendTarget,
	tooltip = true,
	className,
	classNames,
	cssVars,
	...chartProps
}: RadarChartProps<T>) => {
	const chartId = useId()
	const normalizedSeries = normalizeSeries(series, yKey)
	const seriesWithColors = normalizedSeries.map((s, i) =>
		normalizeRadarSeries(s, i, { total: normalizedSeries.length, colors }),
	)

	const legendItems = seriesWithColors.map((s) => ({ key: s.key, color: s.color, label: s.label ?? s.key }))

	return (
		<>
			<ChartContainer className={className} cssVars={cssVars}>
				<RechartsRadarChart {...chartProps} data={data}>
					{renderGradientDefs(seriesWithColors, chartId)}
					<PolarGrid className='stroke-current/25' {...subProps?.polarGrid} />
					<PolarAngleAxis
						className='stroke-current/50 text-sm'
						{...subProps?.polarAngleAxis}
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
						dataKey={angleKey as string}
					/>
					<ChartTooltip
						tooltip={tooltip}
						classNames={classNames?.tooltip}
						resolve={({ active, payload, label }: RadarTooltipProps) => {
							if (!active || !payload?.length) return null
							const multi = payload.length > 1
							return {
								title: label,
								items: payload.map((entry) => ({
									key: String(entry.name),
									color: multi ? entry.color : undefined,
									label: multi ? String(entry.name) : undefined,
									value: entry.value,
								})),
							}
						}}
					/>
					{seriesWithColors.map(({ key, ...s }, i) => (
						<Radar
							key={key}
							{...subProps?.radar}
							{...s}
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
							dataKey={key as string}
							name={s.label ?? key}
							stroke={s.color}
							fill={getAreaFill(s.fill, s.color, `${chartId}-gradient-${i}`)}
						/>
					))}
				</RechartsRadarChart>
			</ChartContainer>
			<ChartLegend legend={legend} items={legendItems} classNames={classNames?.legend} target={legendTarget} />
		</>
	)
}
