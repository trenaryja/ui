import { cn, cnFn, EMPTY_OBJ } from '@/utils'
import type { ComponentType, ReactNode, RefObject } from 'react'
import { createPortal } from 'react-dom'
import type {
	ChoroplethConfig,
	GeoLegendItem,
	GeoMapLegendClassNames,
	GeoMapLegendComponents,
	GeoMapLegendFormatters,
} from './GeoMap.types'
import { DEFAULT_CHORO_COLORS } from './GeoMap.utils'

const DefaultSwatch = ({ item, className }: { item: GeoLegendItem; className?: string }) => (
	<span
		className={cn('size-3 shrink-0 rounded-xs border border-current/25', className)}
		style={{ backgroundColor: item.color }}
	/>
)

const GradientBar = ({ colors, className }: { colors: string[]; className?: string }) => (
	<span
		className={cn('h-3 min-w-20 shrink-0 rounded-field outline outline-current/25', className)}
		style={{ background: `linear-gradient(to right, ${colors.join(', ')})` }}
	/>
)

const maybePortal = (content: ReactNode, target?: RefObject<HTMLElement | null>) =>
	target?.current ? createPortal(content, target.current) : content

export const GeoMapLegend = ({
	items,
	choropleth,
	classNames = EMPTY_OBJ,
	formatters = EMPTY_OBJ,
	components,
	target,
}: {
	items: GeoLegendItem[]
	choropleth: ChoroplethConfig
	classNames?: GeoMapLegendClassNames
	formatters?: GeoMapLegendFormatters
	components?: GeoMapLegendComponents
	target?: RefObject<HTMLElement | null>
}) => {
	const { scaleType = 'quantize', colors } = choropleth
	const stops = colors?.length ? colors : DEFAULT_CHORO_COLORS
	const isLinear = scaleType === 'linear'

	// Full replacement component
	if (typeof components === 'function') {
		const Component = components
		return maybePortal(<Component items={items} scaleType={scaleType} colors={stops} />, target)
	}

	const slots: Exclude<GeoMapLegendComponents, ComponentType<any>> = components ?? EMPTY_OBJ
	const Container = slots.container
	const Item = slots.item
	const Swatch: ComponentType<{ item: GeoLegendItem; className?: string }> = slots.swatch ?? DefaultSwatch

	const containerClassName = cn(
		'flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs',
		classNames.container,
	)

	const children = isLinear ? (
		<>
			<li className={cn('flex items-center gap-1.5', cnFn(classNames.item, items[0]))}>
				<span className={cn('opacity-75', cnFn(classNames.label, items[0]))}>{items[0].label}</span>
			</li>
			<li className='flex items-center'>
				<GradientBar colors={stops} className={classNames.gradient} />
			</li>
			<li className={cn('flex items-center gap-1.5', cnFn(classNames.item, items[1]))}>
				<span className={cn('opacity-75', cnFn(classNames.label, items[1]))}>{items[1].label}</span>
			</li>
		</>
	) : (
		items.map((item) => {
			const label = formatters.label ? formatters.label(item.label, item) : item.label

			if (Item) {
				return (
					<Item key={item.key} item={item} className={cnFn(classNames.item, item)}>
						<Swatch item={item} className={cnFn(classNames.swatch, item)} />
					</Item>
				)
			}

			return (
				<li key={item.key} className={cn('flex items-center gap-1.5', cnFn(classNames.item, item))}>
					<Swatch item={item} className={cnFn(classNames.swatch, item)} />
					<span className={cn('opacity-75', cnFn(classNames.label, item))}>{label}</span>
				</li>
			)
		})
	)

	const content = Container ? (
		<Container items={items} className={containerClassName}>
			{children}
		</Container>
	) : (
		<ul className={containerClassName}>{children}</ul>
	)

	return maybePortal(content, target)
}
