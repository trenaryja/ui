import { cn, cnFn, EMPTY_OBJ, maybeContainer } from '@/utils'
import type { ComponentType } from 'react'
import type {
	GeoMapTooltipClassNames,
	GeoMapTooltipComponents,
	GeoMapTooltipFormatters,
	GeoRegionState,
} from './GeoMap.types'

const defaultValueFormat = (v: number) => v.toLocaleString()

const DefaultSwatch = ({ color, className }: { state: GeoRegionState; color?: string; className?: string }) =>
	color ? (
		<span
			className={cn('size-4 shrink-0 rounded-xs border border-current/25', className)}
			style={{ backgroundColor: color }}
		/>
	) : null

export const GeoMapTooltip = ({
	state,
	color,
	classNames = EMPTY_OBJ,
	formatters = EMPTY_OBJ,
	components = EMPTY_OBJ,
}: {
	state: GeoRegionState
	color?: string
	classNames?: GeoMapTooltipClassNames
	formatters?: GeoMapTooltipFormatters
	components?: Exclude<GeoMapTooltipComponents, ComponentType<any>>
}) => {
	const Container = components.container
	const Swatch = components.swatch ?? DefaultSwatch

	const title = formatters.title ? formatters.title(state) : state.feature.name
	const label = formatters.label ? formatters.label(state) : 'Value'
	const value =
		state.value != null
			? formatters.value
				? formatters.value(state.value, state)
				: defaultValueFormat(state.value)
			: null

	const containerClassName = cn(
		'frosted-glass grid gap-1 rounded border border-current/25 p-2 text-sm shadow',
		cnFn(classNames.container, state),
	)

	const children = (
		<>
			<div className={cn('font-medium', cnFn(classNames.title, state))}>{title}</div>
			{value != null && (
				<div className='flex w-full gap-1 items-center'>
					<Swatch state={state} color={color} className={cnFn(classNames.swatch, state)} />
					<div className='flex justify-between w-full gap-2 items-baseline'>
						<span className={cn('text-base-content/50', cnFn(classNames.label, state))}>{label}</span>
						<span className={cn('font-mono font-bold tabular-nums', cnFn(classNames.value, state))}>{value}</span>
					</div>
				</div>
			)}
		</>
	)

	return maybeContainer(Container, 'div', { state, className: containerClassName, children })
}
