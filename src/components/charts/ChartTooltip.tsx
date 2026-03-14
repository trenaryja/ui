'use client'

import { cn, cnFn } from '@/utils'
import type { FunctionalClassName } from '@/utils'
import { flip, FloatingPortal, offset, shift, useFloating } from '@floating-ui/react'
import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { Tooltip } from 'recharts'
import { ChartSwatch } from './ChartSwatch'

export type ChartTooltipFormatters = {
	title?: (label: ReactNode) => ReactNode
	value?: (value: ReactNode, item: TooltipItem) => ReactNode
	label?: (label: string, item: TooltipItem) => ReactNode
}

export type ChartTooltipClassNames = {
	container?: FunctionalClassName<TooltipData>
	title?: FunctionalClassName<TooltipData>
	row?: FunctionalClassName<TooltipItem>
	swatch?: FunctionalClassName<TooltipItem>
	label?: FunctionalClassName<TooltipItem>
	value?: FunctionalClassName<TooltipItem>
}

export type TooltipItem = {
	key: string
	color?: string
	swatch?: ReactNode
	label?: string
	value: ReactNode
}

export type TooltipData = {
	title?: ReactNode
	items: TooltipItem[]
}

const TooltipPortal = ({ active, children }: { active?: boolean; children: ReactNode }) => {
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
			<div ref={setFloating} style={floatingStyles} className='z-50 pointer-events-none'>
				{children}
			</div>
		</FloatingPortal>
	)
}

export const ChartTooltip = <TProps,>({
	tooltip = true,
	resolve,
	classNames,
	formatters,
}: {
	tooltip?: ((props: TProps) => ReactNode | null) | boolean
	resolve: (props: TProps) => TooltipData | null
	classNames?: ChartTooltipClassNames
	formatters?: ChartTooltipFormatters
}) => {
	if (!tooltip) return null

	const renderContent = (props: TProps): ReactNode | null => {
		if (typeof tooltip === 'function') return tooltip(props)
		const data = resolve(props)
		if (!data) return null
		const title = formatters?.title ? formatters.title(data.title) : data.title
		return (
			<div className={cn('bg-base-300 p-2 rounded-box shadow-lg text-sm', cnFn(classNames?.container, data))}>
				{title != null && <p className={cn('font-bold opacity-50', cnFn(classNames?.title, data))}>{title}</p>}
				{data.items.map((item) => {
					const label = item.label && formatters?.label ? formatters.label(item.label, item) : item.label
					const value = formatters?.value ? formatters.value(item.value, item) : item.value
					return (
						<div key={item.key} className={cn('flex items-center gap-1', cnFn(classNames?.row, item))}>
							{item.swatch ??
								(item.color && <ChartSwatch color={item.color} className={cnFn(classNames?.swatch, item)} />)}
							{label && <span className={cn('opacity-50', cnFn(classNames?.label, item))}>{label}:</span>}
							<span className={cn('font-bold', cnFn(classNames?.value, item))}>{value}</span>
						</div>
					)
				})}
			</div>
		)
	}

	return (
		<Tooltip
			wrapperStyle={{ display: 'none' }}
			content={(props) => (
				<TooltipPortal active={(props as { active?: boolean }).active}>{renderContent(props as TProps)}</TooltipPortal>
			)}
		/>
	)
}
