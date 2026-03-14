'use client'

import { EMPTY_OBJ } from '@/utils'
import { RadialBar, RadialBarChart as RechartsRadialBarChart } from 'recharts'
import { ChartLegend } from '../ChartLegend'
import type { ChartTooltipProps, DeriveProps, PolarChartBaseProps } from '../charts.types'
import { ChartContainer, colorizeData, slotComponents } from '../charts.utils'
import { ChartTooltip } from '../ChartTooltip'

export type RadialBarChartSubProps = {
	radialBar?: DeriveProps<typeof RadialBar, 'dataKey'>
}

export type RadialBarChartProps<TData extends Record<string, unknown>> = PolarChartBaseProps<
	TData,
	typeof RechartsRadialBarChart
> & {
	classNames?: {
		radialBar?: string
	}
	valueKey: string & keyof TData
	nameKey: string & keyof TData
	subProps?: RadialBarChartSubProps
}

export const RadialBarChart = <TData extends Record<string, unknown>>({
	data,
	children,
	valueKey,
	nameKey,
	subProps,
	colors,
	components = EMPTY_OBJ,
	legendTarget,
	className,
	classNames = EMPTY_OBJ,
	formatters = EMPTY_OBJ,
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
						className={classNames.radialBar}
						{...subProps?.radialBar}
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
						dataKey={valueKey as string}
					/>
					{components.tooltip !== false && (
						<ChartTooltip
							classNames={classNames.tooltip}
							formatters={formatters.tooltip}
							components={slotComponents(components.tooltip)}
							resolve={({ active, payload }: ChartTooltipProps) => {
								if (!active || !payload?.length) return null
								const entry = payload[0]
								const name = String(entry.payload?.[nameKey] ?? '')
								return {
									title: name,
									items: [{ key: name, color: entry.color ?? entry.payload?.fill, value: entry.value }],
								}
							}}
						/>
					)}
					{children}
				</RechartsRadialBarChart>
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
