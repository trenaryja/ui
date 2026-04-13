'use client'

import { EMPTY_OBJ } from '@/utils'
import { useState } from 'react'
import { Bar, Brush, CartesianGrid, BarChart as RechartsBarChart, XAxis, YAxis } from 'recharts'
import { ChartLegend } from '../ChartLegend'
import type {
	CartesianChartBaseProps,
	CartesianChartClassNames,
	CartesianSubProps,
	ChartSeries,
	DeriveProps,
} from '../charts.types'
import {
	ChartContainer,
	defaultAxisProps,
	defaultBrushProps,
	defaultGridProps,
	getClickHandler,
	getXFormatters,
	makeTooltipResolver,
	normalizeSeries,
	resolveBrushRangeDomain,
	resolveColor,
	resolveDateData,
	slotComponents,
} from '../charts.utils'
import { ChartTooltip } from '../ChartTooltip'
import { getBarAxisProps, getBarRadius, resolveBarSize } from './BarChart.utils'

export type BarChartProps<
	TData extends Record<string, unknown>,
	TDomainKey extends string & keyof TData = string & keyof TData,
> = CartesianChartBaseProps<TData, TDomainKey, typeof RechartsBarChart> & {
	classNames?: CartesianChartClassNames & {
		bar?: string
	}
	series?: (ChartSeries<TData> &
		DeriveProps<typeof Bar, 'dataKey'> & {
			radius?: number
		})[]
	subProps?: CartesianSubProps & {
		bar?: DeriveProps<typeof Bar, 'dataKey'>
	}
}

export const BarChart = <
	TData extends Record<string, unknown>,
	TDomainKey extends string & keyof TData = string & keyof TData,
>({
	data,
	children,
	domainKey,
	domainType,
	rangeKey,
	valueLabel,
	series,
	subProps = EMPTY_OBJ,
	layout = 'horizontal',
	stacked,
	barSize,
	colors,
	components = EMPTY_OBJ,
	rangeDomain,
	formatters = EMPTY_OBJ,
	onDataClick,
	brushOptions,
	legendTarget,
	className,
	classNames = EMPTY_OBJ,
	cssVars,
	...chartProps
}: BarChartProps<TData, TDomainKey>) => {
	const isStacked = !!stacked
	const stackOffset = typeof stacked === 'string' ? stacked : undefined

	const normalizedSeries = normalizeSeries(series, rangeKey, { label: valueLabel })
	const seriesWithColors = normalizedSeries.map((s, i) => ({
		...s,
		name: s.label ?? s.key,
		color: s.color ?? resolveColor(i, normalizedSeries.length, colors),
		stackId: isStacked && !s.stackId ? 'stack' : s.stackId,
	}))
	const isDate = domainType === 'date'
	const { chartData, timestamps } = resolveDateData(data, domainKey, isDate)
	const { formatX, formatXFull } = getXFormatters(domainType, formatters, timestamps)

	const [containerWidth, setContainerWidth] = useState(0)
	const resolvedBarSize = resolveBarSize(barSize, { isDate, containerWidth, dataLength: chartData.length })

	const resolvedRangeDomain = resolveBrushRangeDomain({
		brushOptions,
		chartData,
		seriesKeys: seriesWithColors.map((s) => s.key),
		rangeDomain,
	})

	const legendItems = seriesWithColors.map((s) => ({ key: s.key, color: s.color, label: s.name }))

	const { xAxisDataKey, xAxisProps, yAxisProps } = getBarAxisProps({
		layout,
		domainKey,
		isDate,
		timestamps,
		domainFormat: formatX,
		rangeFormat: formatters.rangeTick,
		rangeDomain: resolvedRangeDomain,
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
					{components.grid && <CartesianGrid {...defaultGridProps} className={classNames.grid} {...subProps.grid} />}
					{components.xAxis !== false && (
						<XAxis {...defaultAxisProps} className={classNames.xAxis} {...subProps.xAxis} {...xAxisProps} />
					)}
					{components.yAxis !== false && (
						<YAxis {...defaultAxisProps} className={classNames.yAxis} {...subProps.yAxis} {...yAxisProps} />
					)}
					{components.tooltip !== false && (
						<ChartTooltip
							classNames={classNames.tooltip}
							formatters={formatters.tooltip}
							components={slotComponents(components.tooltip)}
							resolve={makeTooltipResolver(seriesWithColors, formatXFull, { valueLabel })}
						/>
					)}
					{seriesWithColors.map(({ key, ...s }, i) => (
						<Bar
							key={key}
							isAnimationActive={!components.brush}
							className={classNames.bar}
							{...s}
							fill={s.color}
							radius={getBarRadius(seriesWithColors, i, { stacked: isStacked, layout })}
							{...subProps.bar}
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion -- recharts dataKey requires string but key is string & keyof TData
							dataKey={key as string}
						/>
					))}
					{components.brush && (
						<Brush {...defaultBrushProps} className={classNames.brush} {...subProps.brush} dataKey={xAxisDataKey} />
					)}
					{children}
				</RechartsBarChart>
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
