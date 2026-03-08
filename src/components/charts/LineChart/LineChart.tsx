'use client'

import { useId } from 'react'
import { Area, Brush, Legend, AreaChart as RechartsAreaChart, XAxis, YAxis } from 'recharts'
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
import type { LineChartProps } from './LineChart.types'
import {
	getAreaFill,
	getLineXAxisProps,
	normalizeLineSeries,
	renderGradientDefs,
	resolveLineSeries,
} from './LineChart.utils'

export type { LineChartProps, LineSeries } from './LineChart.types'

export const LineChart = <T extends Record<string, unknown>, XK extends string & keyof T = string & keyof T>({
	data,
	xKey,
	xType,
	yKey,
	valueLabel,
	series,
	stacked,
	stackOffset,
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
}: LineChartProps<T, XK>) => {
	const chartId = useId()
	const resolvedSeries = resolveLineSeries(series, yKey, valueLabel)
	const seriesWithColors = resolvedSeries.map((s, i) =>
		normalizeLineSeries(s, i, { stacked, total: resolvedSeries.length, colors }),
	)
	const isDate = xType === 'date'
	const { chartData, timestamps } = resolveDateData(data, xKey, isDate)
	const { formatX, formatXFull } = getXFormatters(xType, xFormat, timestamps)
	const xAxisProps = getLineXAxisProps(isDate, xKey, formatX)
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

	return (
		<ChartContainer className={className} cssVars={cssVars}>
			<RechartsAreaChart
				data={chartData}
				stackOffset={stackOffset}
				syncId={syncId}
				syncMethod={syncMethod}
				onClick={getClickHandler(onDataClick)}
			>
				{renderGradientDefs(seriesWithColors, chartId)}
				<XAxis {...axisProps} {...xAxisProps} className={classNames?.xAxis} />
				<YAxis
					{...axisProps}
					allowDecimals={false}
					domain={resolvedYDomain}
					tickFormatter={yFormat}
					className={classNames?.yAxis}
				/>
				{tooltipEl}
				{legend && <Legend className={classNames?.legend} />}
				{renderRefAreas(referenceAreas)}
				{renderRefLines(referenceLines)}
				{seriesWithColors.map((s, i) => (
					<Area
						key={s.key}
						type={s.curve}
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
						dataKey={s.key as string}
						name={s.name}
						stroke={s.color}
						fill={getAreaFill(s.fill, s.color, `${chartId}-gradient-${i}`)}
						fillOpacity={1}
						strokeWidth={s.strokeWidth}
						strokeDasharray={s.strokeDasharray}
						stackId={s.stackId}
						dot={s.dot}
						isAnimationActive={!brush}
					/>
				))}
				{brush && <Brush {...brushProps} dataKey={xAxisProps.dataKey} className={classNames?.brush} />}
			</RechartsAreaChart>
		</ChartContainer>
	)
}
