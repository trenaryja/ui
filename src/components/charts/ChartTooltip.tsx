'use client'

import { cn } from '@/utils'
import { flip, FloatingPortal, offset, shift, useFloating } from '@floating-ui/react'
import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { Tooltip } from 'recharts'
import type { CartesianTooltipProps } from './charts.types'

export const ChartTooltip = ({
	active,
	className,
	children,
}: {
	active?: boolean
	className?: string
	children: ReactNode
}) => {
	const posRef = useRef({ x: 0, y: 0 })
	const { refs, floatingStyles, update } = useFloating({
		placement: 'top',
		middleware: [offset(8), flip(), shift({ padding: 8 })],
	})
	const { setFloating } = refs

	useEffect(() => {
		refs.setReference({
			getBoundingClientRect: () => DOMRect.fromRect({ x: posRef.current.x, y: posRef.current.y, width: 0, height: 0 }),
		})
	}, [refs])

	useEffect(() => {
		if (!active) return
		update()

		const handler = (e: PointerEvent) => {
			posRef.current = { x: e.clientX, y: e.clientY }
			update()
		}

		document.addEventListener('pointermove', handler)
		return () => document.removeEventListener('pointermove', handler)
	}, [active, update])

	if (!active) return null

	return (
		<FloatingPortal>
			<div ref={setFloating} style={floatingStyles} className={cn('z-50 pointer-events-none', className)}>
				{children}
			</div>
		</FloatingPortal>
	)
}

export const TooltipSwatch = ({ color, className }: { color?: string; className?: string }) => (
	<span
		className={cn('size-3 shrink-0 rounded-sm border border-base-content/25', className)}
		style={{ background: color, color }}
	/>
)

type TooltipContentClassNames = {
	container?: string
	title?: string
	row?: string
	swatch?: string
	label?: string
	value?: string
}

export const TooltipContent = ({
	title,
	series,
	showSwatch = true,
	classNames,
}: {
	title?: ReactNode
	series: { key: string; color?: string; label?: string; value: ReactNode }[]
	showSwatch?: boolean
	classNames?: TooltipContentClassNames
}) => (
	<div className={cn('bg-base-300 p-2 rounded-box shadow-lg text-sm', classNames?.container)}>
		{title != null && <p className={cn('font-bold opacity-50', classNames?.title)}>{title}</p>}
		{series.map((s) => (
			<div key={s.key} className={cn('flex items-center gap-1', classNames?.row)}>
				{showSwatch && <TooltipSwatch color={s.color} className={classNames?.swatch} />}
				{s.label && <span className={cn('opacity-50', classNames?.label)}>{s.label}:</span>}
				<span className={cn('font-bold', classNames?.value)}>{s.value}</span>
			</div>
		))}
	</div>
)

export const makeCartesianTooltipContent =
	(series: { key: string; label?: string }[], options?: { xFormatFull?: (v: any) => string; valueLabel?: string }) =>
	({ active, payload, label }: CartesianTooltipProps): ReactNode | null => {
		if (!active || !payload?.length) return null
		const { xFormatFull, valueLabel } = options ?? {}
		const formattedLabel = xFormatFull && label != null ? xFormatFull(label) : label
		return (
			<TooltipContent
				title={formattedLabel}
				showSwatch={series.length > 1}
				series={payload.map((entry) => {
					const s = series.find((x) => x.key === entry.dataKey)
					const { value } = entry
					return {
						key: String(entry.dataKey),
						color: entry.color,
						label: s?.label && !valueLabel ? s.label : undefined,
						value: valueLabel ? `${value} ${valueLabel}${value !== 1 ? 's' : ''}` : String(value),
					}
				})}
			/>
		)
	}

export const chartTooltip = ({
	tooltip = true,
	content,
	className,
}: {
	tooltip?: boolean
	content: (props: any) => ReactNode | null
	className?: string
}): ReactNode =>
	!tooltip ? null : (
		<Tooltip
			wrapperStyle={{ display: 'none' }}
			content={(props: { active?: boolean }) => {
				return (
					<ChartTooltip active={props.active} className={className}>
						{content(props)}
					</ChartTooltip>
				)
			}}
		/>
	)
