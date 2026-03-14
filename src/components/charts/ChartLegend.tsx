import type { FunctionalClassName } from '@/utils'
import { cn, cnFn } from '@/utils'
import type { ReactNode, RefObject } from 'react'
import { createPortal } from 'react-dom'
import { ChartSwatch } from './ChartSwatch'
import type { LegendItem } from './charts.types'

export type ChartLegendFormatters = {
	label?: (label: string, item: LegendItem) => ReactNode
	value?: (value: ReactNode, item: LegendItem) => ReactNode
}

export type ChartLegendClassNames = {
	container?: string
	item?: FunctionalClassName<LegendItem>
	swatch?: FunctionalClassName<LegendItem>
	label?: FunctionalClassName<LegendItem>
	value?: FunctionalClassName<LegendItem>
}

export const ChartLegend = ({
	legend,
	items,
	classNames,
	formatters,
	target,
}: {
	legend?: ((items: LegendItem[]) => ReactNode) | boolean
	items: LegendItem[]
	classNames?: ChartLegendClassNames
	formatters?: ChartLegendFormatters
	target?: RefObject<HTMLElement | null>
}) => {
	if (!legend) return null

	const content =
		typeof legend === 'function' ? (
			legend(items)
		) : (
			<ul className={cn('flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm', classNames?.container)}>
				{items.map((item) => {
					const label = formatters?.label ? formatters.label(item.label, item) : item.label
					const value = item.value != null && formatters?.value ? formatters.value(item.value, item) : item.value
					return (
						<li key={item.key} className={cn('flex items-center gap-1.5', cnFn(classNames?.item, item))}>
							{item.swatch ?? <ChartSwatch color={item.color} className={cnFn(classNames?.swatch, item)} />}
							<span className={cn('opacity-75', cnFn(classNames?.label, item))}>{label}</span>
							{value != null && <span className={cn('font-bold', cnFn(classNames?.value, item))}>{value}</span>}
						</li>
					)
				})}
			</ul>
		)

	if (target?.current) return createPortal(content, target.current)
	return content
}
