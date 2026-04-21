'use client'

import { cn, slotComponents } from '@/utils'
import { FloatingPortal } from '@floating-ui/react'
import type { GeoGeometryObjects } from 'd3-geo'
import type { ComponentProps } from 'react'
import type {
	GeoMapBaseProps,
	GeoMapTooltipComponents,
	GeoMapZoomControlsComponents,
	GeoRegionState,
} from '../GeoMap.types'
import type { buildLegendItems, buildPathGenerator, ChoroData } from '../GeoMap.utils'
import { GeoMapLegend } from './GeoMapLegend'
import { GeoMapTooltip } from './GeoMapTooltip'
import { GeoMapZoomControls } from './GeoMapZoomControls'
import type { TooltipStore } from '../hooks/useGeoMapTooltip'
import { useFloatingTooltip, useTooltipData } from '../hooks/useGeoMapTooltip'
import type { GeoMapViewProps } from '../hooks/useGeoMapView'
import { buildGraticuleMarkup, GeoMapContext, useGeoMapView } from '../hooks/useGeoMapView'

export type { GeoMapViewProps } from '../hooks/useGeoMapView'

const GeoMapGraticule = ({
	pathGen,
	classNames,
	component: Custom,
}: {
	pathGen: ReturnType<typeof buildPathGenerator>
	classNames: { graticule?: string; sphere?: string }
	component: NonNullable<GeoMapBaseProps['components']>['graticule']
}) => {
	if (!Custom) return null
	if (typeof Custom === 'function')
		return <Custom pathGenerator={pathGen as (obj: GeoGeometryObjects) => string | null} />
	return <g dangerouslySetInnerHTML={{ __html: buildGraticuleMarkup(pathGen, classNames) }} />
}

const GeoMapFloatingTooltip = ({
	store,
	selectedIds,
	getChoroFill,
	classNames,
	formatters,
	components,
}: {
	store: TooltipStore
	selectedIds: readonly string[]
	getChoroFill?: (id: string) => string | undefined
	classNames?: GeoMapBaseProps['classNames']
	formatters?: GeoMapBaseProps['formatters']
	components?: GeoMapTooltipComponents
}) => {
	const data = useTooltipData(store)
	const { floatingRef, floatingStyles } = useFloatingTooltip(store, data != null)
	if (!data) return null
	const state: GeoRegionState = {
		feature: data.feature,
		index: data.featureIdx,
		isSelected: selectedIds.includes(data.feature.id),
		isHovered: true,
		value: data.value,
	}
	const color = getChoroFill?.(data.feature.id)
	const CustomTooltip = typeof components === 'function' ? components : null

	return (
		<FloatingPortal>
			<div ref={floatingRef} style={{ ...floatingStyles, pointerEvents: 'none' }}>
				{CustomTooltip ? (
					<CustomTooltip state={state} color={color} />
				) : (
					<GeoMapTooltip
						state={state}
						color={color}
						classNames={classNames?.tooltip}
						formatters={formatters?.tooltip}
						components={typeof components === 'object' ? components : undefined}
					/>
				)}
			</div>
		</FloatingPortal>
	)
}

const GeoMapOverlays = ({
	tooltipStore,
	choro,
	selectedIds,
	classNames,
	formatters,
	components,
	legendItems,
	showLegend,
	choropleth,
	legendTarget,
	zoomTarget,
	zoom,
}: {
	tooltipStore: TooltipStore
	choro: ChoroData | undefined
	selectedIds: readonly string[]
	classNames: NonNullable<GeoMapBaseProps['classNames']>
	formatters: NonNullable<GeoMapBaseProps['formatters']>
	components: NonNullable<GeoMapBaseProps['components']>
	legendItems: ReturnType<typeof buildLegendItems>
	showLegend: boolean
	choropleth: GeoMapBaseProps['choropleth']
	legendTarget?: GeoMapBaseProps['legendTarget']
	zoomTarget?: GeoMapBaseProps['zoomTarget']
	zoom: ComponentProps<GeoMapZoomControlsComponents>
}) => {
	const ZoomSlot = typeof components.zoom === 'function' ? components.zoom : null
	return (
		<>
			{components.tooltip !== false && (
				<GeoMapFloatingTooltip
					store={tooltipStore}
					selectedIds={selectedIds}
					getChoroFill={choro?.fill}
					classNames={classNames}
					formatters={formatters}
					components={slotComponents(components.tooltip)}
				/>
			)}
			{showLegend && choropleth && (
				<GeoMapLegend
					items={legendItems}
					choropleth={choropleth}
					classNames={classNames.legend}
					formatters={formatters.legend}
					components={slotComponents(components.legend)}
					target={legendTarget}
				/>
			)}
			{ZoomSlot ? (
				<ZoomSlot {...zoom} />
			) : (
				components.zoom && <GeoMapZoomControls {...zoom} target={zoomTarget} className={classNames.zoom} />
			)}
		</>
	)
}

export const GeoMapView = (props: GeoMapViewProps) => {
	const {
		svgRef,
		zoomGRef,
		ctxValue,
		viewBox,
		markup,
		pathGen,
		handlers,
		svgProps,
		classNames,
		components,
		overlayProps,
	} = useGeoMapView(props)
	const { className, children, ...restSvgProps } = svgProps
	return (
		<GeoMapContext value={ctxValue}>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				ref={svgRef}
				viewBox={viewBox}
				className={cn('w-full h-auto', className)}
				{...restSvgProps}
			>
				<g ref={zoomGRef}>
					<GeoMapGraticule pathGen={pathGen} classNames={classNames} component={components.graticule} />
					<g
						onClick={handlers.handleClick}
						onMouseOver={handlers.handleMouseOver}
						onMouseMove={handlers.handleMouseMove}
						onMouseOut={handlers.handleMouseOut}
						dangerouslySetInnerHTML={{ __html: markup }}
					/>
					{children}
				</g>
			</svg>
			<GeoMapOverlays {...overlayProps} />
		</GeoMapContext>
	)
}
