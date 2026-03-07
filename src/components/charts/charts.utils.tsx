'use client'

import { format, parseISO } from 'date-fns'
import type { ReactNode } from 'react'
import { ReferenceArea, ReferenceLine, Tooltip } from 'recharts'
import type { ReferenceAreaConfig, ReferenceLineConfig } from './charts.types'

export const defaultCssVars = {
	'--chart-h': '16rem',
	'--chart-extras-base': 'var(--color-primary)',
	'--chart-pie-stroke': 'var(--color-base-100)',
	'--chart-pie-gap': '1px',
	'--chart-mono-from': 'var(--color-base-content)',
	'--chart-mono-to': 'var(--color-base-300)',
} as const

export type ChartCssVars = Partial<Record<keyof typeof defaultCssVars, string>>

const SEMANTIC_COLORS = [
	'var(--color-base-content)',
	'var(--color-primary)',
	'var(--color-secondary)',
	'var(--color-accent)',
] as const

const GOLDEN_ANGLE = 137.508

export const getChartColor = (i: number): string => {
	if (i < SEMANTIC_COLORS.length) return SEMANTIC_COLORS[i]
	const offset = Math.round(GOLDEN_ANGLE * (i - SEMANTIC_COLORS.length + 1)) % 360
	return `oklch(from var(--chart-extras-base) l max(c, 0.15) calc(h + ${offset}))`
}

export const DATE_TS_KEY = '__xTs' as const

export const toDateData = <T extends Record<string, unknown>>(
	data: T[],
	xKey: string & keyof T,
): (Record<typeof DATE_TS_KEY, number> & T)[] =>
	data.map((d) => ({ ...d, [DATE_TS_KEY]: new Date(d[xKey] as string).getTime() }))

export const formatDate = (v: string) => format(parseISO(v), 'MMM d')
export const formatDateFull = (v: string) => format(parseISO(v), 'MMM d, yyyy')

export const ChartEmpty = ({ message }: { message: string }) => (
	<div className='chart flex items-center justify-center opacity-60'>
		<p>{message}</p>
	</div>
)

export const isChartEmpty = <T extends Record<string, unknown>>(data: T[], series: { key: string & keyof T }[]) =>
	data.length === 0 || series.every((s) => data.every((d) => !d[s.key] && d[s.key] !== 0))

type AnyFormatter = (v: any) => string

export const getXFormatters = (xType: string | undefined, xFormat?: (v: string) => string) => {
	if (xType === 'date') {
		const fmt: AnyFormatter = (v: number) => format(new Date(v), 'MMM d')
		const fmtFull: AnyFormatter = (v: number) => format(new Date(v), 'MMM d, yyyy')
		return { formatX: fmt, formatXFull: fmtFull }
	}

	return { formatX: xFormat as AnyFormatter | undefined, formatXFull: undefined }
}

export const makeClickHandler =
	<T,>(fn: (data: T, index: number) => void) =>
	(e: Record<string, unknown>) => {
		const payload = e?.activePayload as { payload: T }[] | undefined
		if (payload?.[0]) fn(payload[0].payload, Number(e.activeTooltipIndex ?? 0))
	}

export const getClickHandler = <T,>(fn?: (data: T, index: number) => void) => (fn ? makeClickHandler(fn) : undefined)

export const axisProps = {
	stroke: 'currentColor',
	opacity: 0.5,
	fontSize: 12,
	tickLine: false,
	axisLine: false,
} as const

export const brushProps = {
	height: 20,
	stroke: 'currentColor',
	fill: 'transparent',
	tickFormatter: () => '',
} as const

export const renderRefAreas = (areas?: ReferenceAreaConfig[]) =>
	areas?.map((ra) => (
		<ReferenceArea
			key={`${ra.x1 ?? ''}-${ra.x2 ?? ''}-${ra.y1 ?? ''}-${ra.y2 ?? ''}`}
			x1={ra.x1}
			x2={ra.x2}
			y1={ra.y1}
			y2={ra.y2}
			label={ra.label}
			className={ra.className}
		/>
	))

export const renderRefLines = (lines?: ReferenceLineConfig[]) =>
	lines?.map((rl) => (
		<ReferenceLine
			key={`${rl.x ?? ''}-${rl.y ?? ''}`}
			x={rl.x}
			y={rl.y}
			label={rl.label}
			className={rl.className}
			stroke='currentColor'
			strokeDasharray='4 2'
			opacity={0.5}
		/>
	))

export const renderTooltip = <P,>(
	tooltip: ((props: unknown) => ReactNode) | boolean,
	content: (props: P) => ReactNode | null,
	wrapperClassName?: string,
) => {
	if (!tooltip) return null
	if (typeof tooltip === 'function') return <Tooltip content={tooltip as (props: unknown) => ReactNode | null} />
	return <Tooltip content={content as (props: unknown) => ReactNode | null} wrapperClassName={wrapperClassName} />
}

type CartesianPayload = {
	active?: boolean
	payload?: { value: unknown; dataKey?: unknown; color?: string }[]
	label?: unknown
}

type CartesianTooltipOptions = {
	tooltip: ((props: unknown) => ReactNode) | boolean
	formatXFull?: (v: any) => string
	series: { key: string; label?: string }[]
	valueLabel?: string
	wrapperClassName?: string
}

type BrushYDomainOptions = {
	brushOptions: { lockYAxis?: boolean } | undefined
	chartData: Record<string, unknown>[]
	seriesKeys: string[]
	yDomain: [number | 'auto' | 'dataMin', number | 'auto' | 'dataMax'] | undefined
}

export const resolveBrushYDomain = ({
	brushOptions,
	chartData,
	seriesKeys,
	yDomain,
}: BrushYDomainOptions): [number | 'auto' | 'dataMin', number | 'auto' | 'dataMax'] | undefined => {
	if (!brushOptions?.lockYAxis) return yDomain
	const max = Math.max(...chartData.flatMap((d) => seriesKeys.map((k) => Number(d[k] ?? 0))))
	return [0, max]
}

export const renderCartesianTooltip = ({
	tooltip,
	formatXFull,
	series,
	valueLabel,
	wrapperClassName,
}: CartesianTooltipOptions) =>
	renderTooltip<CartesianPayload>(
		tooltip,
		({ active, payload, label }) => {
			if (!active || !payload?.length) return null
			const formattedLabel = formatXFull && label != null ? formatXFull(label) : label
			return (
				<div className='bg-base-300 px-3 py-2 rounded-lg shadow-lg'>
					<p className='text-sm opacity-70'>{formattedLabel as ReactNode}</p>
					{payload.map((entry) => {
						const value = entry.value as number
						const s = series.find((x) => x.key === entry.dataKey)
						const labelText =
							s?.label && !valueLabel
								? `${s.label}: ${value}`
								: valueLabel
									? `${value} ${valueLabel}${value !== 1 ? 's' : ''}`
									: String(value)
						return (
							<p key={String(entry.dataKey)} className='font-bold' style={{ color: entry.color }}>
								{labelText}
							</p>
						)
					})}
				</div>
			)
		},
		wrapperClassName,
	)
