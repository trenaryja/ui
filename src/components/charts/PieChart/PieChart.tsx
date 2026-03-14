'use client'

import { EMPTY_OBJ } from '@/utils'
import { Pie, PieChart as RechartsPieChart } from 'recharts'
import { ChartLegend } from '../ChartLegend'
import type { ChartTooltipProps, DeriveProps, PolarChartBaseProps } from '../charts.types'
import { ChartContainer, colorizeData, slotComponents } from '../charts.utils'
import { ChartTooltip } from '../ChartTooltip'
import { normalizePieSeries } from './PieChart.utils'

type PieSliceProps = DeriveProps<typeof Pie, 'data' | 'dataKey' | 'nameKey'>

export type PieChartProps<TData extends Record<string, unknown>> = Pick<
	PieSliceProps,
	'cornerRadius' | 'endAngle' | 'innerRadius' | 'outerRadius' | 'paddingAngle' | 'startAngle'
> &
	PolarChartBaseProps<TData, typeof RechartsPieChart> & {
		classNames?: {
			pie?: string
		}
		valueKey?: string & keyof TData
		nameKey?: string & keyof TData
		series?: (PieSliceProps & {
			valueKey: string & keyof TData
			nameKey: string & keyof TData
		})[]
		donut?: boolean
		noGap?: boolean
		subProps?: { pie?: PieSliceProps }
	}

export const PieChart = <TData extends Record<string, unknown>>({
	data,
	children,
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
	components = EMPTY_OBJ,
	cssVars,
	startAngle = 90,
	endAngle = -270,
	legendTarget,
	className,
	classNames = EMPTY_OBJ,
	formatters = EMPTY_OBJ,
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
					{components.tooltip !== false && (
						<ChartTooltip
							classNames={classNames.tooltip}
							formatters={formatters.tooltip}
							components={slotComponents(components.tooltip)}
							resolve={({ active, payload }: ChartTooltipProps) => {
								if (!active || !payload?.length) return null
								const entry = payload[0]
								const name = entry.name ?? ''
								return {
									title: name,
									items: [{ key: name, color: entry.fill ?? entry.payload?.fill, value: entry.value }],
								}
							}}
						/>
					)}
					{normalizedSeries.map((s) => (
						<Pie
							key={`${s.valueKey}-${s.nameKey}`}
							startAngle={startAngle}
							endAngle={endAngle}
							className={classNames.pie}
							{...subProps?.pie}
							{...s}
							data={colorizedData}
							dataKey={s.valueKey}
							nameKey={s.nameKey}
						/>
					))}
					{children}
				</RechartsPieChart>
			</ChartContainer>
			{components.legend !== false && (
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
