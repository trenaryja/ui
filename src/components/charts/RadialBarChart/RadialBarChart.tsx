'use client'

import { cn } from '@/utils'
import { Legend, RadialBar, RadialBarChart as RechartsRadialBarChart, ResponsiveContainer } from 'recharts'
import { ChartEmpty, getChartColor, renderTooltip } from '../charts.utils'
import type { RadialBarChartProps } from './RadialBarChart.types'

export type { RadialBarChartProps } from './RadialBarChart.types'

export const RadialBarChart = <T extends Record<string, unknown>>({
	data,
	valueKey,
	nameKey,
	innerRadius = '30%',
	outerRadius = '100%',
	legend,
	tooltip = true,
	classNames,
	emptyMessage = 'No data available',
}: RadialBarChartProps<T>) => {
	if (data.length === 0) return <ChartEmpty message={emptyMessage} />

	const coloredData = data.map((item, i) => ({ ...item, fill: getChartColor(i) }))

	return (
		<div className={cn('chart', classNames?.container)}>
			<ResponsiveContainer width='100%' height='100%' minWidth={0}>
				<RechartsRadialBarChart
					data={coloredData}
					innerRadius={innerRadius}
					outerRadius={outerRadius}
					startAngle={90}
					endAngle={-270}
				>
					<RadialBar dataKey={valueKey} background={{ fill: 'currentColor', opacity: 0.05 }} />
					{renderTooltip<{ active?: boolean; payload?: { payload?: unknown }[] }>(
						tooltip,
						({ active, payload }) => {
							if (!active || !payload?.length) return null
							const item = payload[0].payload as T
							return (
								<div className='bg-base-300 px-3 py-2 rounded-lg shadow-lg'>
									<p className='text-sm opacity-70'>{item[nameKey] as string}</p>
									<p className='font-bold'>{item[valueKey] as number}</p>
								</div>
							)
						},
						classNames?.tooltip,
					)}
					{legend && <Legend iconSize={10} className={classNames?.legend} />}
				</RechartsRadialBarChart>
			</ResponsiveContainer>
		</div>
	)
}
