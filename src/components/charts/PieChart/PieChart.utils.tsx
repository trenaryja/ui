import type { ReactNode } from 'react'
import { getChartColor } from '../charts.utils'
import type { PieSeries } from './PieChart.types'

type PieTooltipProps = { active?: boolean; payload?: { name: unknown; value: unknown }[] }

export const renderPieTooltipContent = ({ active, payload }: PieTooltipProps): ReactNode | null => {
	if (!active || !payload?.length) return null
	const entry = payload[0]
	return (
		<div className='bg-base-300 px-3 py-2 rounded-lg shadow-lg'>
			<p className='text-sm opacity-70'>{entry.name as string}</p>
			<p className='font-bold'>{entry.value as number}</p>
		</div>
	)
}

export const resolveInnerRadius = (innerRadius: number | string | undefined, donut: boolean | undefined) =>
	innerRadius ?? (donut ? '80%' : undefined)

export const getSliceFill = (i: number, total: number, monotone: boolean | undefined): string => {
	if (!monotone) return getChartColor(i)
	const pct = total <= 1 ? 100 : Math.round((1 - i / (total - 1)) * 100)
	return `color-mix(in oklch, var(--chart-mono-from) ${pct}%, var(--chart-mono-to))`
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
