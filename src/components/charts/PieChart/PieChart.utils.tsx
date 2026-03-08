import type { ReactNode } from 'react'
import { TooltipContent } from '../ChartTooltip'
import type { PieTooltipProps } from '../charts.types'
import type { PieSeries } from './PieChart.types'

export const renderPieTooltipContent = ({ active, payload }: PieTooltipProps): ReactNode | null => {
	if (!active || !payload?.length) return null
	const item = payload[0]
	const color = item.payload?.fill ?? item.fill
	return <TooltipContent title={item.name} series={[{ key: item.name, color, value: item.value }]} />
}

export const resolvePieSeries = <T extends Record<string, unknown>>(
	series: PieSeries<T>[] | undefined,
	shorthand: Partial<PieSeries<T>>,
): PieSeries<T>[] => {
	if (series) return series
	const { valueKey, nameKey } = shorthand
	if (valueKey && nameKey) return [{ ...shorthand, valueKey, nameKey }]
	return []
}
