'use client'

import { Pie, PieChart as RechartsPieChart } from 'recharts'
import { ChartLegend } from '../ChartLegend'
import type {
	DeriveProps,
	PieChartClassNames,
	PieChartCssVars,
	PieTooltipProps,
	PolarChartBaseProps,
} from '../charts.types'
import { ChartContainer, colorizeData } from '../charts.utils'
import { ChartTooltip } from '../ChartTooltip'
import { normalizePieSeries } from './PieChart.utils'

type PieSliceProps = DeriveProps<typeof Pie, 'data' | 'dataKey' | 'nameKey'>

export type PieChartProps<TData extends Record<string, unknown>> = Pick<
	PieSliceProps,
	'cornerRadius' | 'endAngle' | 'innerRadius' | 'outerRadius' | 'paddingAngle' | 'startAngle'
> &
	PolarChartBaseProps<TData, PieTooltipProps, typeof RechartsPieChart> & {
		classNames?: PieChartClassNames
		valueKey?: string & keyof TData
		nameKey?: string & keyof TData
		series?: (PieSliceProps & {
			valueKey: string & keyof TData
			nameKey: string & keyof TData
		})[]
		donut?: boolean
		noGap?: boolean
		cssVars?: PieChartCssVars
		subProps?: { pie?: PieSliceProps }
	}

export const PieChart = <TData extends Record<string, unknown>>({
	data,
	valueKey,
	nameKey,
	innerRadius,
	outerRadius = '100%',
	cornerRadius,
	paddingAngle,
	series,
	subProps,
	donut,
	noGap,
	colors,
	cssVars,
	startAngle = 90,
	endAngle = -270,
	legend,
	legendTarget,
	tooltip = true,
	className,
	classNames,
	formatters,
	...chartProps
}: PieChartProps<TData>) => {
	const normalizedSeries = normalizePieSeries(series, {
		valueKey,
		nameKey,
		innerRadius: innerRadius ?? (donut ? '80%' : undefined),
		outerRadius,
		cornerRadius,
		paddingAngle,
	})

	const colorizedData = colorizeData(data, colors)

	const legendItems = colorizedData.map((item, i) => {
		const name = nameKey ? String(item[nameKey]) : String(i)
		return { key: name, color: item.fill, label: name }
	})

	return (
		<>
			<ChartContainer className={className} cssVars={{ ...(noGap && { '--chart-pie-gap': '0' }), ...cssVars }}>
				<RechartsPieChart {...chartProps}>
					<ChartTooltip
						tooltip={tooltip}
						classNames={classNames?.tooltip}
						formatters={formatters?.tooltip}
						resolve={({ active, payload }: PieTooltipProps) => {
							if (!active || !payload?.length) return null
							const entry = payload[0]
							return {
								title: entry.name,
								items: [{ key: entry.name, color: entry.fill ?? entry.payload?.fill, value: entry.value }],
							}
						}}
					/>
					{normalizedSeries.map((s) => (
						<Pie
							key={`${s.valueKey}-${s.nameKey}`}
							outerRadius='100%'
							startAngle={startAngle}
							endAngle={endAngle}
							className={classNames?.pie}
							{...subProps?.pie}
							{...s}
							data={colorizedData}
							dataKey={s.valueKey}
							nameKey={s.nameKey}
						/>
					))}
				</RechartsPieChart>
			</ChartContainer>
			<ChartLegend
				legend={legend}
				items={legendItems}
				classNames={classNames?.legend}
				formatters={formatters?.legend}
				target={legendTarget}
			/>
		</>
	)
}
