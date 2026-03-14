'use client'

import { FloatingPortal } from '@floating-ui/react'
import { svgGeoMaps } from '@/data/svg-geo-maps'
import type { SvgGeoMapLocation } from '@/data/svg-geo-maps'
import { cn, cnFn } from '@/utils'
import { ChoroplethLegend } from '../ChoroplethLegend'
import type { GeoMapBaseProps } from '../GeoMap.types'
import { GeoMapTooltip } from '../GeoMapTooltip'
import { SvgPatternDefs } from '../SvgPatternDefs'
import { useGeoMap } from '../useGeoMap'

export type GeoMapStaticProps = GeoMapBaseProps & {
	variant?: 'static'
	selectedIds?: SvgGeoMapLocation['id'][]
}

export const GeoMapStatic = ({
	map: mapName,
	className,
	classNames,
	choropleth,
	selectedIds = [],
	renderTooltip,
	tooltipPlacement,
	onRegionClick,
	onRegionMouseEnter,
	onRegionMouseLeave,
	children,
	defaultTooltipProps,
	...svgProps
}: GeoMapStaticProps) => {
	const mapData = svgGeoMaps[mapName]
	const hasTooltip = !!renderTooltip
	const { hoveredId, setHoveredId, getRegionState, getChoroFill, floatingRef, floatingStyles, onRegionMouseMove } =
		useGeoMap({
			selectedIds,
			choropleth,
			tooltipPlacement,
			hasTooltip,
		})

	const showLegend = !!choropleth?.data.length && !selectedIds.length

	const hoveredState = hoveredId
		? (() => {
				const idx = mapData.locations.findIndex((l) => l.id === hoveredId)
				if (idx === -1) return null
				return getRegionState(mapData.locations[idx]!, idx)
			})()
		: null

	const tooltipContent =
		hoveredState && renderTooltip
			? typeof renderTooltip === 'function'
				? renderTooltip(hoveredState)
				: (() => {
						const choroFill = getChoroFill?.(hoveredState.location.id)
						return <GeoMapTooltip state={hoveredState} color={choroFill} {...defaultTooltipProps} />
					})()
			: null

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
						const choroFill = getChoroFill?.(location.id)
						const isZero = state.value == null || state.value === 0
						return (
							<path
								key={location.id}
								d={location.path}
								className={cn(
									'transition-colors cursor-pointer',
									'stroke-base-content/20',
									'hover:stroke-base-content hover:z-10',
									'fill-base-100',
									isZero && classNames?.zeroRegion,
									state.isSelected && cn('fill-base-content', classNames?.selectedRegion),
									state.isHovered && !state.isSelected && cn('fill-base-300', classNames?.hoveredRegion),
									cnFn(classNames?.region, state),
								)}
								style={choroFill && !selectedIds.length ? { fill: choroFill } : undefined}
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
				{showLegend && <ChoroplethLegend viewBox={mapData.viewBox} choropleth={choropleth} classNames={classNames} />}
				<SvgPatternDefs />
				{children}
			</svg>
			{tooltipContent && (
				<FloatingPortal>
					<div ref={floatingRef} style={{ ...floatingStyles, pointerEvents: 'none' }}>
						{tooltipContent}
					</div>
				</FloatingPortal>
			)}
		</>
	)
}
