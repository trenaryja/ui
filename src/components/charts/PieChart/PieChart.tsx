'use client'

import { ChartEmpty, renderTooltip } from '../charts.utils'
import { cn, css } from '@/utils'
import { Legend, Pie, PieChart as RechartsPieChart, ResponsiveContainer } from 'recharts'
import type { PieChartProps } from './PieChart.types'
import { getSliceFill, renderPieTooltipContent, resolveInnerRadius, resolvePieSeries } from './PieChart.utils'

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
	monotone,
	cssVars,
	startAngle = 90,
	endAngle = -270,
	legend,
	tooltip = true,
	classNames,
	emptyMessage = 'No data available',
}: PieChartProps<T>) => {
	const resolvedSeries = resolvePieSeries(series, {
		valueKey,
		nameKey,
		innerRadius: resolveInnerRadius(innerRadius, donut),
		outerRadius,
		cornerRadius,
		paddingAngle,
	})

	if (data.length === 0 || resolvedSeries.length === 0) {
		return <ChartEmpty message={emptyMessage} />
	}

	const coloredData = data.map((item, i) => ({ ...item, fill: getSliceFill(i, data.length, monotone) }))

	return (
		<div
			className={cn('chart', classNames?.container)}
			style={css({ ...(noGap && { '--chart-pie-gap': '0' }), ...cssVars })}
		>
			<ResponsiveContainer width='100%' height='100%' minWidth={0} initialDimension={{ width: 1, height: 1 }}>
				<RechartsPieChart>
					{renderTooltip(tooltip, renderPieTooltipContent, classNames?.tooltip)}
					{legend && <Legend className={classNames?.legend} />}
					{resolvedSeries.map((s) => (
						<Pie
							key={`${String(s.valueKey)}-${String(s.nameKey)}`}
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
			</ResponsiveContainer>
		</div>
	)
}
