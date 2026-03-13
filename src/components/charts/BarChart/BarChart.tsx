'use client'

import { useState } from 'react'
import { Bar, Brush, BarChart as RechartsBarChart, XAxis, YAxis } from 'recharts'
import { ChartLegend } from '../ChartLegend'
import type { CartesianChartBaseProps, CartesianSubProps, ChartSeries, DeriveProps } from '../charts.types'
import {
	axisProps,
	brushProps,
	ChartContainer,
	getClickHandler,
	getXFormatters,
	normalizeSeries,
	renderRefAreas,
	renderRefLines,
	resolveBrushYDomain,
	resolveDateData,
} from '../charts.utils'
import { ChartTooltip } from '../ChartTooltip'
import { getBarAxisProps, getBarRadius, normalizeBarSeries, resolveBarSize } from './BarChart.utils'

export type BarChartProps<
	T extends Record<string, unknown>,
	XK extends string & keyof T = string & keyof T,
> = CartesianChartBaseProps<T, XK, typeof RechartsBarChart> & {
	series?: (ChartSeries<T> &
		DeriveProps<typeof Bar, 'dataKey'> & {
			radius?: number
		})[]
	subProps?: CartesianSubProps & {
		bar?: DeriveProps<typeof Bar, 'dataKey'>
	}
}

export const BarChart = <T extends Record<string, unknown>, XK extends string & keyof T = string & keyof T>({
	data,
	xKey,
	xType,
	yKey,
	valueLabel,
	series,
	subProps,
	layout = 'horizontal',
	stacked,
	barSize,
	colors,
	yDomain,
	yFormat,
	xFormat,
	referenceLines,
	referenceAreas,
	onDataClick,
	brush,
	brushOptions,
	legend,
	legendTarget,
	tooltip = true,
	className,
	classNames,
	cssVars,
	...chartProps
}: BarChartProps<T, XK>) => {
	const isStacked = !!stacked
	const stackOffset = typeof stacked === 'string' ? stacked : undefined

	const normalizedSeries = normalizeSeries(series, yKey, { label: valueLabel })
	const seriesWithColors = normalizedSeries.map((s, i) =>
		normalizeBarSeries(s, i, { stacked: isStacked, total: normalizedSeries.length, colors }),
	)
	const isDate = xType === 'date'
	const { chartData, timestamps } = resolveDateData(data, xKey, isDate)
	const { formatX, formatXFull } = getXFormatters(xType, xFormat, timestamps)

	const [containerWidth, setContainerWidth] = useState(0)
	const resolvedBarSize = resolveBarSize(barSize, { isDate, containerWidth, dataLength: chartData.length })

	const resolvedYDomain = resolveBrushYDomain({
		brushOptions,
		chartData,
		seriesKeys: seriesWithColors.map((s) => s.key),
		yDomain,
	})

	const legendItems = seriesWithColors.map((s) => ({ key: s.key, color: s.color, label: s.name }))

	const { xAxisDataKey, xAxisProps, yAxisProps } = getBarAxisProps({
		layout,
		xKey,
		isDate,
		timestamps,
		xFormat: formatX,
		yFormat,
		yDomain: resolvedYDomain,
	})

	return (
		<>
			<ChartContainer className={className} cssVars={cssVars} onResize={(w) => setContainerWidth(w)}>
				<RechartsBarChart
					layout={layout}
					stackOffset={stackOffset}
					barSize={resolvedBarSize}
					{...chartProps}
					data={chartData}
					onClick={getClickHandler(onDataClick)}
				>
					<XAxis {...axisProps} className={classNames?.xAxis} {...subProps?.xAxis} {...xAxisProps} />
					<YAxis {...axisProps} className={classNames?.yAxis} {...subProps?.yAxis} {...yAxisProps} />
					<ChartTooltip
						tooltip={tooltip}
						classNames={classNames?.tooltip}
						resolve={({ active, payload, label }) => {
							if (!active || !payload?.length) return null
							const multi = seriesWithColors.length > 1
							return {
								title: formatXFull && label != null ? formatXFull(label) : label,
								items: payload.map((entry) => {
									const s = seriesWithColors.find((x) => x.key === entry.dataKey)
									const { value } = entry
									return {
										key: entry.dataKey,
										color: multi ? (s?.color ?? entry.color) : undefined,
										label: multi ? s?.name : undefined,
										value: valueLabel ? `${value} ${valueLabel}${value !== 1 ? 's' : ''}` : value,
									}
								}),
							}
						}}
					/>
					{renderRefAreas(referenceAreas)}
					{renderRefLines(referenceLines)}
					{seriesWithColors.map(({ key, ...s }, i) => (
						<Bar
							key={key}
							isAnimationActive={!brush}
							{...subProps?.bar}
							{...s}
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
							dataKey={key as string}
							fill={s.color}
							radius={getBarRadius(seriesWithColors, i, { stacked: isStacked, layout })}
						/>
					))}
					{brush && <Brush {...brushProps} className={classNames?.brush} {...subProps?.brush} dataKey={xAxisDataKey} />}
				</RechartsBarChart>
			</ChartContainer>
			<ChartLegend legend={legend} items={legendItems} classNames={classNames?.legend} target={legendTarget} />
		</>
	)
}
