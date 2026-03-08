'use client'

import { Legend, RadialBar, RadialBarChart as RechartsRadialBarChart } from 'recharts'
import { ChartContainer, resolveColor } from '../charts.utils'
import { chartTooltip, TooltipContent } from '../ChartTooltip'
import type { RadialBarChartProps } from './RadialBarChart.types'

export type { RadialBarChartProps } from './RadialBarChart.types'

export const RadialBarChart = <T extends Record<string, unknown>>({
	data,
	valueKey,
	nameKey,
	innerRadius = '30%',
	outerRadius = '100%',
	colors,
	legend,
	tooltip = true,
	tooltipContent,
	className,
	classNames,
	cssVars,
}: RadialBarChartProps<T>) => {
	const tooltipEl = chartTooltip({
		tooltip,
		content:
			tooltipContent ??
			(({ active, payload }) => {
				if (!active || !payload?.length) return null
				const item = payload[0].payload
				if (!item) return null
				const name = String(item[nameKey])
				return <TooltipContent title={name} series={[{ key: name, color: item.fill, value: String(item[valueKey]) }]} />
			}),
		className: classNames?.tooltip,
	})

	const coloredData = data.map((item, i) => ({ ...item, fill: resolveColor(i, data.length, colors) }))

	return (
		<ChartContainer className={className} cssVars={cssVars}>
			<RechartsRadialBarChart
				data={coloredData}
				innerRadius={innerRadius}
				outerRadius={outerRadius}
				startAngle={90}
				endAngle={-270}
			>
				{/* eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion */}
				<RadialBar dataKey={valueKey as string} background={{ fill: 'currentColor', opacity: 0.05 }} />
				{tooltipEl}
				{legend && <Legend iconSize={10} className={classNames?.legend} />}
			</RechartsRadialBarChart>
		</ChartContainer>
	)
}
