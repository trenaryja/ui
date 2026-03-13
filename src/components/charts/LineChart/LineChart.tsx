'use client'

import { useId } from 'react'
import { Area, Brush, AreaChart as RechartsAreaChart, XAxis, YAxis } from 'recharts'
import { ChartLegend } from '../ChartLegend'
import type {
	CartesianChartBaseProps,
	CartesianSubProps,
	ChartSeries,
	CurveType,
	DeriveProps,
	FillType,
} from '../charts.types'
import {
	axisProps,
	brushProps,
	ChartContainer,
	getAreaFill,
	getClickHandler,
	getXFormatters,
	normalizeSeries,
	renderGradientDefs,
	renderRefAreas,
	renderRefLines,
	resolveBrushYDomain,
	resolveDateData,
} from '../charts.utils'
import { ChartSwatch } from '../ChartSwatch'
import { ChartTooltip } from '../ChartTooltip'
import { getLineXAxisProps, normalizeLineSeries } from './LineChart.utils'

export type LineChartProps<
	T extends Record<string, unknown>,
	XK extends string & keyof T = string & keyof T,
> = CartesianChartBaseProps<T, XK, typeof RechartsAreaChart> & {
	series?: (ChartSeries<T> &
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

export const LineChart = <T extends Record<string, unknown>, XK extends string & keyof T = string & keyof T>({
	data,
	xKey,
	xType,
	yKey,
	valueLabel,
	series,
	subProps,
	stacked,
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
}: LineChartProps<T, XK>) => {
	const chartId = useId()
	const isStacked = !!stacked
	const stackOffset = typeof stacked === 'string' ? stacked : undefined

	const normalizedSeries = normalizeSeries(series, yKey, { label: valueLabel })
	const seriesWithColors = normalizedSeries.map((s, i) =>
		normalizeLineSeries(s, i, { stacked: isStacked, total: normalizedSeries.length, colors }),
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

	const makeSwatch = (s: (typeof seriesWithColors)[number], swatchClassName?: string) => (
		<ChartSwatch
			variant={s.fill === 'solid' ? 'square' : s.fill && s.fill !== 'none' ? 'area' : 'line'}
			color={s.color}
			strokeWidth={s.strokeWidth}
			strokeDasharray={s.strokeDasharray}
			className={swatchClassName}
		/>
	)

	const legendItems = seriesWithColors.map((s) => ({
		key: s.key,
		color: s.color,
		label: s.name,
		swatch: makeSwatch(s, classNames?.legend?.swatch),
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
					<XAxis {...axisProps} className={classNames?.xAxis} {...subProps?.xAxis} {...xAxisProps} />
					<YAxis
						{...axisProps}
						className={classNames?.yAxis}
						{...subProps?.yAxis}
						domain={resolvedYDomain}
						tickFormatter={yFormat}
					/>
					<ChartTooltip
						tooltip={tooltip}
						classNames={classNames?.tooltip}
						resolve={({ active, payload, label }) => {
							if (!active || !payload?.length) return null
							return {
								title: formatXFull && label != null ? formatXFull(label) : label,
								items: payload.map((entry) => {
									const s = seriesWithColors.find((x) => x.key === entry.dataKey)
									const { value } = entry
									const multi = seriesWithColors.length > 1
									return {
										key: entry.dataKey,
										color: multi ? (s?.color ?? entry.color) : undefined,
										swatch: multi && s ? makeSwatch(s, classNames?.tooltip?.swatch) : undefined,
										label: multi && s?.name && !valueLabel ? s.name : undefined,
										value: valueLabel ? `${value} ${valueLabel}${value !== 1 ? 's' : ''}` : value,
									}
								}),
							}
						}}
					/>
					{renderRefAreas(referenceAreas)}
					{renderRefLines(referenceLines)}
					{seriesWithColors.map(({ key, ...s }, i) => (
						<Area
							key={key}
							fillOpacity={1}
							isAnimationActive={!brush}
							{...subProps?.area}
							{...s}
							type={s.curve}
							// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
							dataKey={key as string}
							stroke={s.color}
							fill={getAreaFill(s.fill, s.color, `${chartId}-gradient-${i}`)}
						/>
					))}
					{brush && (
						<Brush {...brushProps} className={classNames?.brush} {...subProps?.brush} dataKey={xAxisProps.dataKey} />
					)}
				</RechartsAreaChart>
			</ChartContainer>
			<ChartLegend legend={legend} items={legendItems} classNames={classNames?.legend} target={legendTarget} />
		</>
	)
}
