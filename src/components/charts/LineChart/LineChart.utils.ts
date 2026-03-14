import type { CurveType, FillType } from '../charts.types'
import { DATE_TS_KEY, resolveColor } from '../charts.utils'

export const getLineXAxisProps = (
	isDate: boolean,
	domainKey: string,
	domainFormat: ((v: any) => string) | undefined,
) => ({
	dataKey: isDate ? DATE_TS_KEY : domainKey,
	tickFormatter: domainFormat,
	...(isDate ? { type: 'number' as const, scale: 'time' as const, domain: ['dataMin', 'dataMax'] as const } : {}),
})

export const normalizeLineSeries = (
	s: {
		key: string
		label?: string
		color?: string
		fill?: string
		curve?: string
		strokeWidth?: number
		strokeDasharray?: string
		stackId?: number | string
		dot?: unknown
	},
	i: number,
	{ stacked, total, colors }: { stacked?: boolean; total: number; colors?: string[] },
) => ({
	name: s.label ?? s.key,
	key: s.key,
	dot: s.dot ?? false,
	color: s.color ?? resolveColor(i, total, colors),
	fill: (s.fill ?? 'none') as FillType,
	curve: (s.curve ?? 'monotone') as CurveType,
	strokeWidth: s.strokeWidth ?? 2,
	strokeDasharray: s.strokeDasharray,
	stackId: stacked && !s.stackId ? 'stack' : s.stackId,
})
