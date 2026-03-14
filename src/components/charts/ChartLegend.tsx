import type { FunctionalClassName } from '@/utils'
import { cn, cnFn } from '@/utils'
import type { ComponentType, ReactNode, RefObject } from 'react'
import { createPortal } from 'react-dom'
import type { ChartLegendComponents, LegendItem } from './charts.types'
import { ChartSwatch } from './ChartSwatch'

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

const DefaultSwatch = ({ item, className }: { item: LegendItem; className?: string }) => (
	<>{item.swatch ?? <ChartSwatch color={item.color} className={className} />}</>
)

export const ChartLegend = ({
	items,
	classNames,
	formatters,
	components,
	target,
}: {
	items: LegendItem[]
	classNames?: ChartLegendClassNames
	formatters?: ChartLegendFormatters
	components?: ChartLegendComponents
	target?: RefObject<HTMLElement | null>
}) => {
	// Full replacement component
	if (typeof components === 'function') {
		const Component = components
		const content = <Component items={items} />
		if (target?.current) return createPortal(content, target.current)
		return content
	}

	const slots = components
	const Container = slots?.container
	const Item = slots?.item
	const Swatch: ComponentType<{ item: LegendItem; className?: string }> = slots?.swatch ?? DefaultSwatch

	const containerClassName = cn(
		'flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm',
		classNames?.container,
	)

	const children = items.map((item) => {
		const label = formatters?.label ? formatters.label(item.label, item) : item.label
		const value = item.value != null && formatters?.value ? formatters.value(item.value, item) : item.value

		if (Item) {
			return (
				<Item key={item.key} item={item} className={cnFn(classNames?.item, item)}>
					<Swatch item={item} className={cnFn(classNames?.swatch, item)} />
				</Item>
			)
		}

		return (
			<li key={item.key} className={cn('flex items-center gap-1.5', cnFn(classNames?.item, item))}>
				<Swatch item={item} className={cnFn(classNames?.swatch, item)} />
				<span className={cn('opacity-75', cnFn(classNames?.label, item))}>{label}</span>
				{value != null && <span className={cn('font-bold', cnFn(classNames?.value, item))}>{value}</span>}
			</li>
		)
	})

	const content = Container ? (
		<Container items={items} className={containerClassName}>
			{children}
		</Container>
	) : (
		<ul className={containerClassName}>{children}</ul>
	)

	if (target?.current) return createPortal(content, target.current)
	return content
}
