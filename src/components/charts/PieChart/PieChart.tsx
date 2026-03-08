'use client'

import { Legend, Pie, PieChart as RechartsPieChart } from 'recharts'
import { ChartContainer, resolveColor } from '../charts.utils'
import { chartTooltip } from '../ChartTooltip'
import type { PieChartProps } from './PieChart.types'
import { renderPieTooltipContent, resolvePieSeries } from './PieChart.utils'

export type { PieChartProps, PieSeries } from './PieChart.types'

export const PieChart = <T extends Record<string, unknown>>({
	data,
	valueKey,
	nameKey,
	innerRadius,
	outerRadius = '100%',
	cornerRadius,
	paddingAngle,
	series,
	donut,
	noGap,
	colors,
	cssVars,
	startAngle = 90,
	endAngle = -270,
	legend,
	tooltip = true,
	tooltipContent,
	className,
	classNames,
}: PieChartProps<T>) => {
	const resolvedSeries = resolvePieSeries(series, {
		valueKey,
		nameKey,
		innerRadius: innerRadius ?? (donut ? '80%' : undefined),
		outerRadius,
		cornerRadius,
		paddingAngle,
	})

	const coloredData = data.map((item, i) => ({ ...item, fill: resolveColor(i, data.length, colors) }))
	const tooltipEl = chartTooltip({
		tooltip,
		content: tooltipContent ?? renderPieTooltipContent,
		className: classNames?.tooltip,
	})

	return (
		<ChartContainer
			className={className}
			cssVars={{ ...(noGap && { '--chart-pie-gap': '0' }), ...cssVars }}
			initialDimension={{ width: 1, height: 1 }}
		>
			<RechartsPieChart>
				{legend && <Legend className={classNames?.legend} />}
				{tooltipEl}
				{resolvedSeries.map((s) => (
					<Pie
						key={`${s.valueKey}-${s.nameKey}`}
						data={coloredData}
						dataKey={s.valueKey}
						nameKey={s.nameKey}
						innerRadius={s.innerRadius}
						outerRadius={s.outerRadius ?? '100%'}
						cornerRadius={s.cornerRadius}
						paddingAngle={s.paddingAngle}
						startAngle={startAngle}
						endAngle={endAngle}
					/>
				))}
			</RechartsPieChart>
		</ChartContainer>
	)
}
