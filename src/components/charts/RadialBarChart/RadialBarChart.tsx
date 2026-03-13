'use client'

import { RadialBar, RadialBarChart as RechartsRadialBarChart } from 'recharts'
import { ChartLegend } from '../ChartLegend'
import type { DeriveProps, PolarChartBaseProps, RadialBarTooltipProps } from '../charts.types'
import { ChartContainer, colorizeData } from '../charts.utils'
import { ChartTooltip } from '../ChartTooltip'

export type RadialBarChartSubProps = {
	radialBar?: DeriveProps<typeof RadialBar, 'dataKey'>
}

export type RadialBarChartProps<T extends Record<string, unknown>> = PolarChartBaseProps<
	T,
	RadialBarTooltipProps,
	typeof RechartsRadialBarChart
> & {
	valueKey: string & keyof T
	nameKey: string & keyof T
	subProps?: RadialBarChartSubProps
}

export const RadialBarChart = <T extends Record<string, unknown>>({
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
	cssVars,
	...chartProps
}: RadialBarChartProps<T>) => {
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
						{...subProps?.radialBar}
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
						dataKey={valueKey as string}
					/>
					<ChartTooltip
						tooltip={tooltip}
						classNames={classNames?.tooltip}
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
			<ChartLegend legend={legend} items={legendItems} classNames={classNames?.legend} target={legendTarget} />
		</>
	)
}
