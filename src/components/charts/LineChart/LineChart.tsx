'use client'

import { cn } from '@/utils'
import { useId } from 'react'
import { Area, Brush, Legend, AreaChart as RechartsAreaChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import {
	axisProps,
	brushProps,
	ChartEmpty,
	getClickHandler,
	getXFormatters,
	isChartEmpty,
	renderCartesianTooltip,
	renderRefAreas,
	renderRefLines,
	resolveBrushYDomain,
	toDateData,
} from '../charts.utils'
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
	emptyMessage = 'No data available',
	classNames,
}: LineChartProps<T, XK>) => {
	const chartId = useId()
	const resolvedSeries = resolveLineSeries(series, yKey, valueLabel)
	const seriesWithColors = resolvedSeries.map(normalizeLineSeries)
	const { formatX, formatXFull } = getXFormatters(xType, xFormat)
	const isDate = xType === 'date'
	const chartData = isDate ? toDateData(data, xKey) : data
	const xAxisProps = getLineXAxisProps(isDate, xKey as string, formatX)
	const resolvedYDomain = resolveBrushYDomain({
		brushOptions,
		chartData,
		seriesKeys: seriesWithColors.map((s) => s.key),
		yDomain,
	})

	if (isChartEmpty(data, resolvedSeries)) return <ChartEmpty message={emptyMessage} />

	return (
		<div className={cn('chart', classNames?.container)}>
			<ResponsiveContainer width='100%' height='100%' minWidth={0}>
				<RechartsAreaChart
					data={chartData}
					margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
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
					{renderCartesianTooltip({
						tooltip,
						formatXFull,
						series: seriesWithColors,
						valueLabel,
						wrapperClassName: classNames?.tooltip,
					})}
					{legend && <Legend className={classNames?.legend} />}
					{renderRefAreas(referenceAreas)}
					{renderRefLines(referenceLines)}
					{seriesWithColors.map((s, i) => (
						<Area
							key={s.key}
							type={s.curve}
							dataKey={s.key}
							name={s.name}
							stroke={s.color}
							fill={getAreaFill(s.fill, s.color, `${chartId}-gradient-${i}`)}
							fillOpacity={1}
							strokeWidth={s.strokeWidth}
							strokeDasharray={s.strokeDasharray}
							dot={s.dot}
							isAnimationActive={!brush}
						/>
					))}
					{brush && <Brush {...brushProps} dataKey={xAxisProps.dataKey} className={classNames?.brush} />}
				</RechartsAreaChart>
			</ResponsiveContainer>
		</div>
	)
}
