'use client'

import { EMPTY_OBJ } from '@/utils'
import { useId } from 'react'
import { Area, Brush, CartesianGrid, AreaChart as RechartsAreaChart, XAxis, YAxis } from 'recharts'
import { ChartLegend } from '../ChartLegend'
import type {
	CartesianChartBaseProps,
	CartesianChartClassNames,
	CartesianSubProps,
	ChartSeries,
	CurveType,
	DeriveProps,
	FillType,
} from '../charts.types'
import {
	ChartContainer,
	defaultAxisProps,
	defaultBrushProps,
	defaultGridProps,
	getAreaFill,
	getClickHandler,
	getXFormatters,
	makeTooltipResolver,
	normalizeSeries,
	renderGradientDefs,
	resolveBrushRangeDomain,
	resolveDateData,
	slotComponents,
} from '../charts.utils'
import { ChartSwatch } from '../ChartSwatch'
import { ChartTooltip } from '../ChartTooltip'
import { getLineXAxisProps, normalizeLineSeries } from './LineChart.utils'

export type LineChartProps<
	TData extends Record<string, unknown>,
	TDomainKey extends string & keyof TData = string & keyof TData,
> = CartesianChartBaseProps<TData, TDomainKey, typeof RechartsAreaChart> & {
	classNames?: CartesianChartClassNames & {
		area?: string
	}
	series?: (ChartSeries<TData> &
		DeriveProps<typeof Area, 'dataKey'> & {
			fill?: FillType
			curve?: CurveType
			strokeWidth?: number
			strokeDasharray?: string
		})[]
	subProps?: CartesianSubProps & {
		area?: DeriveProps<typeof Area, 'dataKey'>
	}
}

export const LineChart = <
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
	stacked,
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
}: LineChartProps<TData, TDomainKey>) => {
	const chartId = useId()
	const isStacked = !!stacked
	const stackOffset = typeof stacked === 'string' ? stacked : undefined

	const normalizedSeries = normalizeSeries(series, rangeKey, { label: valueLabel })
	const seriesWithColors = normalizedSeries.map((s, i) =>
		normalizeLineSeries(s, i, { stacked: isStacked, total: normalizedSeries.length, colors }),
	)
	const isDate = domainType === 'date'
	const { chartData, timestamps } = resolveDateData(data, domainKey, isDate)
	const { formatX, formatXFull } = getXFormatters(domainType, formatters, timestamps)
	const xAxisProps = getLineXAxisProps(isDate, domainKey, formatX)
	const resolvedRangeDomain = resolveBrushRangeDomain({
		brushOptions,
		chartData,
		seriesKeys: seriesWithColors.map((s) => s.key),
		rangeDomain,
	})

	const makeSwatch = (s: (typeof seriesWithColors)[number]) => (
		<ChartSwatch
			variant={s.fill === 'solid' ? 'square' : s.fill && s.fill !== 'none' ? 'area' : 'line'}
			color={s.color}
			strokeWidth={s.strokeWidth}
			strokeDasharray={s.strokeDasharray}
		/>
	)

	const legendItems = seriesWithColors.map((s) => ({
		key: s.key,
		color: s.color,
		label: s.name,
		swatch: makeSwatch(s),
	}))

	return (
		<>
			<ChartContainer className={className} cssVars={cssVars}>
				<RechartsAreaChart
					stackOffset={stackOffset}
					{...chartProps}
					data={chartData}
					onClick={getClickHandler(onDataClick)}
				>
					{renderGradientDefs(seriesWithColors, chartId)}
					{components.grid && <CartesianGrid {...defaultGridProps} className={classNames.grid} {...subProps.grid} />}
					{components.xAxis !== false && (
						<XAxis {...defaultAxisProps} className={classNames.xAxis} {...subProps.xAxis} {...xAxisProps} />
					)}
					{components.yAxis !== false && (
						<YAxis
							{...defaultAxisProps}
							className={classNames.yAxis}
							{...subProps.yAxis}
							domain={resolvedRangeDomain}
							tickFormatter={formatters.rangeTick}
						/>
					)}
					{components.tooltip !== false && (
						<ChartTooltip
							classNames={classNames.tooltip}
							formatters={formatters.tooltip}
							components={slotComponents(components.tooltip)}
							resolve={makeTooltipResolver(seriesWithColors, formatXFull, { valueLabel, makeSwatch })}
						/>
					)}
					{seriesWithColors.map(({ key, ...s }, i) => (
						<Area
							key={key}
							fillOpacity={1}
							isAnimationActive={!components.brush}
							className={classNames.area}
							{...s}
							type={s.curve}
							stroke={s.color}
							fill={getAreaFill(s.fill, s.color, `${chartId}-gradient-${i}`)}
							{...subProps.area}
							dataKey={key}
						/>
					))}
					{components.brush && (
						<Brush
							{...defaultBrushProps}
							className={classNames.brush}
							{...subProps.brush}
							dataKey={xAxisProps.dataKey}
						/>
					)}
					{children}
				</RechartsAreaChart>
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
