'use client'

import { cn } from '@/utils'
import { useEffect, useRef, useState } from 'react'
import { Bar, Brush, Legend, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
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
	toDateData,
} from '../charts.utils'
import type { BarChartProps } from './BarChart.types'
import {
	buildLastPerStack,
	getBarAxisProps,
	getBarRadius,
	getResolvedBarSize,
	normalizeBarSeries,
	resolveBarSeries,
} from './BarChart.utils'

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
}: BarChartProps<T, XK>) => {
	const resolvedSeries = resolveBarSeries(series, yKey, valueLabel)
	const seriesWithColors = resolvedSeries.map(normalizeBarSeries(stacked))
	const { formatX, formatXFull } = getXFormatters(xType, xFormat)
	const isDate = xType === 'date'
	const chartData = isDate ? toDateData(data, xKey) : data

	const containerRef = useRef<HTMLDivElement>(null)
	const [containerWidth, setContainerWidth] = useState(0)
	useEffect(() => {
		const el = containerRef.current
		if (!el) return
		const observer = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width))
		observer.observe(el)
		return () => observer.disconnect()
	}, [])

	const resolvedBarSize = getResolvedBarSize({ isDate, containerWidth, dataLength: chartData.length, barSize })

	if (isChartEmpty(data, resolvedSeries)) return <ChartEmpty message={emptyMessage} />

	const { xAxisDataKey, xAxisProps, yAxisProps } = getBarAxisProps({
		layout,
		xKey: xKey as string,
		isDate,
		chartData,
		formatX,
		yFormat,
		yDomain,
		brushOptions,
		seriesKeys: seriesWithColors.map((s) => s.key),
	})

	const lastPerStack = buildLastPerStack(seriesWithColors)

	return (
		<div ref={containerRef} className={cn('chart', classNames?.container)}>
			<ResponsiveContainer width='100%' height='100%' minWidth={0}>
				<RechartsBarChart
					data={chartData}
					layout={layout}
					margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
					stackOffset={stackOffset}
					barSize={resolvedBarSize}
					barCategoryGap={barCategoryGap}
					syncId={syncId}
					syncMethod={syncMethod}
					onClick={getClickHandler(onDataClick)}
				>
					<XAxis {...axisProps} {...xAxisProps} className={classNames?.xAxis} />
					<YAxis {...axisProps} {...yAxisProps} allowDecimals={false} className={classNames?.yAxis} />
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
						<Bar
							key={s.key}
							dataKey={s.key}
							name={s.name}
							fill={s.color}
							stackId={s.stackId}
							radius={getBarRadius(s.radius, stacked, { isLast: lastPerStack.get(s.stackId) === i, layout })}
							isAnimationActive={!brush}
						/>
					))}
					{brush && <Brush {...brushProps} dataKey={xAxisDataKey} className={classNames?.brush} />}
				</RechartsBarChart>
			</ResponsiveContainer>
		</div>
	)
}
