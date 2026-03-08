'use client'

import { useState } from 'react'
import { Bar, Brush, Legend, BarChart as RechartsBarChart, XAxis, YAxis } from 'recharts'
import {
	axisProps,
	brushProps,
	ChartContainer,
	getClickHandler,
	getXFormatters,
	renderRefAreas,
	renderRefLines,
	resolveBrushYDomain,
	resolveDateData,
} from '../charts.utils'
import { chartTooltip, makeCartesianTooltipContent } from '../ChartTooltip'
import type { BarChartProps } from './BarChart.types'
import { getBarAxisProps, getBarRadius, normalizeBarSeries, resolveBarSeries } from './BarChart.utils'

export type { BarChartProps, BarSeries } from './BarChart.types'

export const BarChart = <T extends Record<string, unknown>, XK extends string & keyof T = string & keyof T>({
	data,
	xKey,
	xType,
	yKey,
	valueLabel,
	series,
	layout = 'horizontal',
	stacked,
	stackOffset,
	barSize,
	barCategoryGap,
	colors,
	yDomain,
	yFormat,
	xFormat,
	referenceLines,
	referenceAreas,
	syncId,
	syncMethod,
	onDataClick,
	brush,
	brushOptions,
	legend,
	tooltip = true,
	tooltipContent,
	className,
	classNames,
	cssVars,
}: BarChartProps<T, XK>) => {
	const resolvedSeries = resolveBarSeries(series, yKey, valueLabel)
	const seriesWithColors = resolvedSeries.map((s, i) =>
		normalizeBarSeries(s, i, { stacked, total: resolvedSeries.length, colors }),
	)
	const isDate = xType === 'date'
	const { chartData, timestamps } = resolveDateData(data, xKey, isDate)
	const { formatX, formatXFull } = getXFormatters(xType, xFormat, timestamps)

	const [containerWidth, setContainerWidth] = useState(0)
	const resolvedBarSize =
		isDate && containerWidth > 0 ? Math.max(1, (containerWidth / chartData.length) * 0.75) : barSize

	const resolvedYDomain = resolveBrushYDomain({
		brushOptions,
		chartData,
		seriesKeys: seriesWithColors.map((s) => s.key),
		yDomain,
	})

	const tooltipEl = chartTooltip({
		tooltip,
		content: tooltipContent ?? makeCartesianTooltipContent(seriesWithColors, { xFormatFull: formatXFull, valueLabel }),
		className: classNames?.tooltip,
	})

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
		<ChartContainer className={className} cssVars={cssVars} onResize={(w) => setContainerWidth(w)}>
			<RechartsBarChart
				data={chartData}
				layout={layout}
				stackOffset={stackOffset}
				barSize={resolvedBarSize}
				barCategoryGap={barCategoryGap}
				syncId={syncId}
				syncMethod={syncMethod}
				onClick={getClickHandler(onDataClick)}
			>
				<XAxis {...axisProps} {...xAxisProps} className={classNames?.xAxis} />
				<YAxis {...axisProps} {...yAxisProps} allowDecimals={false} className={classNames?.yAxis} />
				{tooltipEl}
				{legend && <Legend className={classNames?.legend} />}
				{renderRefAreas(referenceAreas)}
				{renderRefLines(referenceLines)}
				{seriesWithColors.map((s, i) => (
					<Bar
						key={s.key}
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
						dataKey={s.key as string}
						name={s.name}
						fill={s.color}
						stackId={s.stackId}
						radius={getBarRadius(seriesWithColors, i, { stacked, layout })}
						isAnimationActive={!brush}
					/>
				))}
				{brush && <Brush {...brushProps} dataKey={xAxisDataKey} className={classNames?.brush} />}
			</RechartsBarChart>
		</ChartContainer>
	)
}
