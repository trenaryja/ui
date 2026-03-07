import type { ReactNode } from 'react'
import { DATE_TS_KEY, getChartColor } from '../charts.utils'
import type { LineSeries } from './LineChart.types'

export const resolveLineSeries = <T extends Record<string, unknown>>(
	series: LineSeries<T>[] | undefined,
	yKey: (string & keyof T) | undefined,
	valueLabel: string | undefined,
): LineSeries<T>[] => series ?? (yKey ? [{ key: yKey, label: valueLabel }] : [])

export const getLineXAxisProps = (isDate: boolean, xKey: string, formatX: ((v: any) => string) | undefined) => ({
	dataKey: isDate ? DATE_TS_KEY : xKey,
	tickFormatter: formatX,
	...(isDate ? { type: 'number' as const, scale: 'time' as const, domain: ['dataMin', 'dataMax'] as const } : {}),
})

export const getAreaFill = (fill: string, color: string, gradientId: string) => {
	if (fill === 'gradient') return `url(#${gradientId})`
	if (fill === 'solid') return color
	return 'none'
}

export const renderGradientDefs = (
	series: { fill: string; color: string; key: string }[],
	chartId: string,
): ReactNode => {
	if (!series.some((s) => s.fill === 'gradient')) return null
	return (
		<defs>
			{series.map((s, i) =>
				s.fill === 'gradient' ? (
					<linearGradient key={s.key} id={`${chartId}-gradient-${i}`} x1='0' y1='0' x2='0' y2='1'>
						<stop offset='5%' stopColor={s.color} stopOpacity={0.3} />
						<stop offset='95%' stopColor={s.color} stopOpacity={0} />
					</linearGradient>
				) : null,
			)}
		</defs>
	)
}

export const normalizeLineSeries = <T extends Record<string, unknown>>(s: LineSeries<T>, i: number) => ({
	...s,
	name: s.label ?? s.key,
	dot: s.dot ?? false,
	color: s.color ?? getChartColor(i),
	fill: s.fill ?? 'none',
	curve: s.curve ?? 'monotone',
	strokeWidth: s.strokeWidth ?? 2,
})
