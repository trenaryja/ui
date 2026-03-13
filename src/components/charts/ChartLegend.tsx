import { cn } from '@/utils'
import type { ReactNode, RefObject } from 'react'
import { createPortal } from 'react-dom'
import { ChartSwatch } from './ChartSwatch'
import type { LegendItem } from './charts.types'

export type ChartLegendClassNames = {
	container?: string
	item?: string
	swatch?: string
	label?: string
	value?: string
}

export const ChartLegend = ({
	legend,
	items,
	classNames,
	target,
}: {
	legend?: ((items: LegendItem[]) => ReactNode) | boolean
	items: LegendItem[]
	classNames?: ChartLegendClassNames
	target?: RefObject<HTMLElement | null>
}) => {
	if (!legend) return null

	const content =
		typeof legend === 'function' ? (
			legend(items)
		) : (
			<ul className={cn('flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm', classNames?.container)}>
				{items.map((item) => (
					<li key={item.key} className={cn('flex items-center gap-1.5', classNames?.item)}>
						{item.swatch ?? <ChartSwatch color={item.color} className={classNames?.swatch} />}
						<span className={cn('opacity-75', classNames?.label)}>{item.label}</span>
						{item.value != null && <span className={cn('font-bold', classNames?.value)}>{item.value}</span>}
					</li>
				))}
			</ul>
		)

	if (target?.current) return createPortal(content, target.current)
	return content
}
