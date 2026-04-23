import { cn, cnFn, EMPTY_OBJ, maybeContainer } from '@/utils'
import type { ComponentType } from 'react'
import type {
	GeoMapTooltipClassNames,
	GeoMapTooltipComponents,
	GeoMapTooltipFormatters,
	GeoTooltipState,
} from '../GeoMap.types'

const DefaultSwatch = ({ color, className }: { state: GeoTooltipState; color?: string; className?: string }) =>
	color ? (
		<span
			className={cn('size-4 shrink-0 rounded-xs border border-current/25', className)}
			style={{ backgroundColor: color }}
		/>
	) : null

const getName = (state: GeoTooltipState) => {
	if (state.kind === 'region') return state.feature.name
	if (state.kind === 'point') return state.point.name
	return `${state.count.toLocaleString()} points`
}

const getValue = (state: GeoTooltipState): number | undefined => {
	if (state.kind === 'cluster') return state.count
	return state.value
}

export const GeoMapTooltip = ({
	state,
	color,
	classNames = EMPTY_OBJ,
	formatters = EMPTY_OBJ,
	components = EMPTY_OBJ,
}: {
	state: GeoTooltipState
	color?: string
	classNames?: GeoMapTooltipClassNames
	formatters?: GeoMapTooltipFormatters
	components?: Exclude<GeoMapTooltipComponents, ComponentType<any>>
}) => {
	const Swatch = components.swatch ?? DefaultSwatch
	const title = formatters.title ? formatters.title(state) : getName(state)
	const label = formatters.label ? formatters.label(state) : state.kind === 'cluster' ? 'Count' : 'Value'
	const rawValue = getValue(state)
	const value =
		rawValue != null
			? formatters.value
				? formatters.value(rawValue, state)
				: rawValue.toLocaleString()
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

	return maybeContainer(components.container, 'div', { state, className: containerClassName, children })
}
