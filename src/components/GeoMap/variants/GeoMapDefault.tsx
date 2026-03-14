'use client'

import type { SvgGeoMapLocation } from '@/data/svg-geo-maps'
import { svgGeoMaps } from '@/data/svg-geo-maps'
import { cn, cnFn, EMPTY_ARR, EMPTY_OBJ } from '@/utils'
import { FloatingPortal } from '@floating-ui/react'
import type { GeoMapBaseProps, GeoMapTooltipComponents, GeoRegionState } from '../GeoMap.types'
import { buildLegendItems } from '../GeoMap.utils'
import { GeoMapLegend } from '../GeoMapLegend'
import { GeoMapTooltip } from '../GeoMapTooltip'
import { SvgPatternDefs } from '../SvgPatternDefs'
import { useGeoMap } from '../useGeoMap'

/** Extract custom components from a slot value, filtering out booleans. */
const slotComponents = <T,>(slot: boolean | T | undefined): T | undefined =>
	typeof slot === 'boolean' || slot == null ? undefined : slot

const TooltipContent = ({
	components: tooltipComponents,
	...props
}: {
	state: React.ComponentProps<typeof GeoMapTooltip>['state']
	color?: string
	classNames?: React.ComponentProps<typeof GeoMapTooltip>['classNames']
	formatters?: React.ComponentProps<typeof GeoMapTooltip>['formatters']
	components?: GeoMapTooltipComponents
}) => {
	if (typeof tooltipComponents === 'function') {
		const Replacement = tooltipComponents
		return <Replacement state={props.state} color={props.color} />
	}

	return <GeoMapTooltip {...props} components={tooltipComponents} />
}

export type GeoMapDefaultProps = GeoMapBaseProps & {
	variant?: 'default'
	selectedIds?: readonly SvgGeoMapLocation['id'][]
}

const regionClassName = (state: GeoRegionState, classNames: NonNullable<GeoMapBaseProps['classNames']>) =>
	cn(
		'transition-colors',
		'stroke-base-content/20',
		'hover:stroke-base-content hover:z-10',
		'fill-base-100',
		state.isSelected && 'fill-base-content',
		state.isHovered && !state.isSelected && 'fill-base-300',
		cnFn(classNames.region, state),
	)

export const GeoMapDefault = ({
	map: mapName,
	className,
	classNames = EMPTY_OBJ,
	choropleth,
	selectedIds = EMPTY_ARR,
	components = EMPTY_OBJ,
	formatters = EMPTY_OBJ,
	legendTarget,
	onRegionClick,
	onRegionMouseEnter,
	onRegionMouseLeave,
	children,
	...svgProps
}: GeoMapDefaultProps) => {
	const mapData = svgGeoMaps[mapName]
	const hasTooltip = components.tooltip !== false
	const { hoveredId, setHoveredId, getRegionState, getChoroFill, floatingRef, floatingStyles, onRegionMouseMove } =
		useGeoMap({ selectedIds, choropleth, hasTooltip })

	const hasSelection = selectedIds.length > 0
	const hoveredIdx = hoveredId ? mapData.locations.findIndex((l) => l.id === hoveredId) : -1
	const hoveredState = hoveredIdx >= 0 ? getRegionState(mapData.locations[hoveredIdx], hoveredIdx) : null
	const showTooltip = hasTooltip && hoveredState
	const showLegend = !!(components.legend && choropleth?.data.length && !hasSelection)
	const legendItems = showLegend ? buildLegendItems(choropleth) : []
	const tooltipSlot = slotComponents(components.tooltip)
	const legendSlot = slotComponents(components.legend)

	return (
		<>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				viewBox={mapData.viewBox}
				className={cn('w-full h-auto', className)}
				{...svgProps}
			>
				<g>
					{mapData.locations.map((location, index) => {
						const state = getRegionState(location, index)
						const choroFill = getChoroFill(location.id)
						return (
							<path
								key={location.id}
								d={location.path}
								className={regionClassName(state, classNames)}
								style={choroFill && !hasSelection ? { fill: choroFill } : undefined}
								onClick={() => onRegionClick?.(location, index)}
								onMouseEnter={() => {
									setHoveredId(location.id)
									onRegionMouseEnter?.(location, index)
								}}
								onMouseMove={onRegionMouseMove}
								onMouseLeave={() => {
									setHoveredId(undefined)
									onRegionMouseLeave?.(location, index)
								}}
							/>
						)
					})}
				</g>
				<SvgPatternDefs />
				{children}
			</svg>
			{showTooltip && (
				<FloatingPortal>
					<div ref={floatingRef} style={{ ...floatingStyles, pointerEvents: 'none' }}>
						<TooltipContent
							state={hoveredState}
							color={getChoroFill(hoveredState.location.id)}
							classNames={classNames.tooltip}
							formatters={formatters.tooltip}
							components={tooltipSlot}
						/>
					</div>
				</FloatingPortal>
			)}
			{showLegend && (
				<GeoMapLegend
					items={legendItems}
					choropleth={choropleth}
					classNames={classNames.legend}
					formatters={formatters.legend}
					components={legendSlot}
					target={legendTarget}
				/>
			)}
		</>
	)
}
