'use client'

import { cn, EMPTY_OBJ } from '@/utils'
import { useId } from 'react'
import { PolarAngleAxis, PolarGrid, Radar, RadarChart as RechartsRadarChart } from 'recharts'
import { ChartLegend } from '../ChartLegend'
import type { ChartSeries, ChartTooltipProps, DeriveProps, FillType, PolarChartBaseProps } from '../charts.types'
import {
	ChartContainer,
	getAreaFill,
	normalizeSeries,
	renderGradientDefs,
	resolveColor,
	slotComponents,
} from '../charts.utils'
import { ChartTooltip } from '../ChartTooltip'

export type RadarChartProps<TData extends Record<string, unknown>> = PolarChartBaseProps<
	TData,
	typeof RechartsRadarChart
> & {
	classNames?: {
		polarGrid?: string
		polarAngleAxis?: string
		radar?: string
	}
	components?: {
		polarGrid?: false
		polarAngleAxis?: false
	}
	angleKey: string & keyof TData
	rangeKey?: string & keyof TData
	series?: (ChartSeries<TData> &
		DeriveProps<typeof Radar, 'dataKey'> & {
			fill?: FillType
		})[]
	subProps?: {
		radar?: DeriveProps<typeof Radar, 'dataKey'>
		polarGrid?: DeriveProps<typeof PolarGrid>
		polarAngleAxis?: DeriveProps<typeof PolarAngleAxis, 'dataKey'>
	}
}

export const RadarChart = <TData extends Record<string, unknown>>({
	data,
	children,
	angleKey,
	rangeKey,
	series,
	colors,
	components = EMPTY_OBJ,
	subProps = EMPTY_OBJ,
	legendTarget,
	className,
	classNames = EMPTY_OBJ,
	formatters = EMPTY_OBJ,
	cssVars,
	...chartProps
}: RadarChartProps<TData>) => {
	const chartId = useId()
	const normalizedSeries = normalizeSeries(series, rangeKey)
	const seriesWithColors = normalizedSeries.map((s, i) => ({
		...s,
		color: s.color ?? resolveColor(i, normalizedSeries.length, colors),
		fill: s.fill ?? 'gradient',
	}))

	const legendItems = seriesWithColors.map((s) => ({ key: s.key, color: s.color, label: s.label ?? s.key }))

	return (
		<>
			<ChartContainer className={className} cssVars={cssVars}>
				<RechartsRadarChart {...chartProps} data={data}>
					{renderGradientDefs(seriesWithColors, chartId)}
					{components.polarGrid !== false && (
						<PolarGrid className={cn('stroke-current/25', classNames.polarGrid)} {...subProps.polarGrid} />
					)}
					{components.polarAngleAxis !== false && (
						<PolarAngleAxis
							className={cn('stroke-current/50 text-sm', classNames.polarAngleAxis)}
							{...subProps.polarAngleAxis}
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
							dataKey={angleKey as string}
							{...(formatters.label && { tickFormatter: formatters.label })}
						/>
					)}
					{components.tooltip !== false && (
						<ChartTooltip
							classNames={classNames.tooltip}
							formatters={formatters.tooltip}
							components={slotComponents(components.tooltip)}
							resolve={({ active, payload, label }: ChartTooltipProps) => {
								if (!active || !payload?.length) return null
								const multi = payload.length > 1
								return {
									title: label,
									items: payload.map((entry) => ({
										key: entry.name ?? '',
										color: multi ? entry.color : undefined,
										label: multi ? entry.name : undefined,
										value: entry.value,
									})),
								}
							}}
						/>
					)}
					{seriesWithColors.map(({ key, label, ...s }, i) => (
						<Radar
							key={key}
							className={classNames.radar}
							{...s}
							name={label ?? key}
							stroke={s.color}
							fill={getAreaFill(s.fill, s.color, `${chartId}-gradient-${i}`)}
							{...subProps.radar}
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
							dataKey={key as string}
						/>
					))}
					{children}
				</RechartsRadarChart>
			</ChartContainer>
			{components.legend && (
				<ChartLegend
					items={legendItems}
					classNames={classNames.legend}
					formatters={formatters.legend}
					components={slotComponents(components.legend)}
					target={legendTarget}
				/>
			)}
		</>
	)
}
