'use client'

import { RadialBar, RadialBarChart as RechartsRadialBarChart } from 'recharts'
import { ChartLegend } from '../ChartLegend'
import type { DeriveProps, PolarChartBaseProps, RadialBarChartClassNames, RadialBarTooltipProps } from '../charts.types'
import { ChartContainer, colorizeData } from '../charts.utils'
import { ChartTooltip } from '../ChartTooltip'

export type RadialBarChartSubProps = {
	radialBar?: DeriveProps<typeof RadialBar, 'dataKey'>
}

export type RadialBarChartProps<TData extends Record<string, unknown>> = PolarChartBaseProps<
	TData,
	RadialBarTooltipProps,
	typeof RechartsRadialBarChart
> & {
	classNames?: RadialBarChartClassNames
	valueKey: string & keyof TData
	nameKey: string & keyof TData
	subProps?: RadialBarChartSubProps
}

export const RadialBarChart = <TData extends Record<string, unknown>>({
	data,
	valueKey,
	nameKey,
	subProps,
	colors,
	legend,
	legendTarget,
	tooltip = true,
	className,
	classNames,
	formatters,
	cssVars,
	...chartProps
}: RadialBarChartProps<TData>) => {
	const colorizedData = colorizeData(data, colors)

	const legendItems = colorizedData.map((item) => ({
		key: String(item[nameKey]),
		color: item.fill,
		label: String(item[nameKey]),
	}))

	return (
		<>
			<ChartContainer className={className} cssVars={cssVars}>
				<RechartsRadialBarChart {...chartProps} data={colorizedData}>
					<RadialBar
						background={{ fill: 'currentColor', opacity: 0.05 }}
						className={classNames?.radialBar}
						{...subProps?.radialBar}
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
						dataKey={valueKey as string}
					/>
					<ChartTooltip
						tooltip={tooltip}
						classNames={classNames?.tooltip}
						formatters={formatters?.tooltip}
						resolve={({ active, payload }: RadialBarTooltipProps) => {
							if (!active || !payload?.length) return null
							const entry = payload[0]
							const name = String(entry.payload?.[nameKey] ?? '')
							return {
								title: name,
								items: [{ key: name, color: entry.color ?? entry.payload?.fill, value: entry.value }],
							}
						}}
					/>
				</RechartsRadialBarChart>
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
