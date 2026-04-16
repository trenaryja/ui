'use client'

import { cn, cnFn, EMPTY_ARR, EMPTY_OBJ, slotComponents } from '@/utils'
import { FloatingPortal } from '@floating-ui/react'
import type { GeoGeometryObjects } from 'd3-geo'
import { geoGraticule } from 'd3-geo'
import { useEffect, useMemo, useRef, useState } from 'react'
import {
	buildPathGenerator,
	defaultProjectionForPreset,
	filterFeatures,
	getDragBehavior,
	getProjectionAspectRatio,
	isGeoMapPreset,
	resolveProjection,
} from './GeoMap.geo'
import type { GeoMapBaseProps, GeoMapTooltipComponents, GeoRegionState } from './GeoMap.types'
import type { ChoroData } from './GeoMap.utils'
import { buildLegendItems, getChoroData } from './GeoMap.utils'
import { GeoMapLegend } from './GeoMapLegend'
import { GeoMapTooltip } from './GeoMapTooltip'
import { GeoMapZoomControls } from './GeoMapZoomControls'
import { SvgPatternDefs } from './SvgPatternDefs'
import { useGeoData } from './useGeoData'
import type { GeoMapContextValue } from './useGeoMap'
import { GeoMapContext } from './useGeoMap'
import type { TooltipStore } from './useGeoMapTooltip'
import { createTooltipStore, useFloatingTooltip, useTooltipData } from './useGeoMapTooltip'
import { useGeoZoom } from './useGeoZoom'

const VIEWBOX_W = 1000

const SPHERE: GeoGeometryObjects = { type: 'Sphere' }

const UNSELECTED_CLASS = cn(
	'stroke-base-content/20',
	'hover:stroke-base-content hover:z-10',
	'fill-base-100',
	'hover:fill-base-300',
)

const SELECTED_CLASS = cn('stroke-base-content/20', 'hover:stroke-base-content hover:z-10', 'fill-base-content')

export type GeoMapViewProps = GeoMapBaseProps & {
	selectedIds?: readonly string[]
}

const useGeoProjection = (
	props: Pick<GeoMapBaseProps, 'geo' | 'projection' | 'region'> & { rotation?: [number, number] },
) => {
	const { features: allFeatures } = useGeoData(props.geo)
	const features = props.region ? filterFeatures(allFeatures, props.region) : allFeatures

	const effectiveProjection =
		props.projection ??
		(typeof props.geo === 'string' && isGeoMapPreset(props.geo) ? defaultProjectionForPreset(props.geo) : undefined)
	const presetName = typeof effectiveProjection === 'string' ? effectiveProjection : undefined
	const dragBehavior = getDragBehavior(presetName)
	const aspect = getProjectionAspectRatio(effectiveProjection)
	const viewBoxH = VIEWBOX_W / aspect
	const projection = resolveProjection(effectiveProjection, VIEWBOX_W, viewBoxH)

	if (props.rotation && projection.rotate) projection.rotate([props.rotation[0], props.rotation[1], 0])

	// Pan projections fit to features so a filtered region fills the viewport;
	// rotate projections fit to sphere so the rotation can move the visible area freely.
	if (dragBehavior === 'pan' && features.length > 0) {
		const fc: GeoJSON.FeatureCollection = {
			type: 'FeatureCollection',
			features: features.map((f) => ({ type: 'Feature' as const, geometry: f.geometry, properties: {} })),
		}
		projection.fitSize([VIEWBOX_W, viewBoxH], fc)
	}

	return { features, projection, pathGen: buildPathGenerator(projection), dragBehavior, viewBoxW: VIEWBOX_W, viewBoxH }
}

// Builds a single innerHTML string for all features — bypasses React reconciliation for thousands of paths.
const buildPathMarkup = ({
	features,
	pathGen,
	selectedIds,
	choro,
	classNames,
}: {
	features: ReturnType<typeof useGeoProjection>['features']
	pathGen: ReturnType<typeof buildPathGenerator>
	selectedIds: readonly string[]
	choro: ChoroData | undefined
	classNames: NonNullable<GeoMapBaseProps['classNames']>
}) => {
	const selectedSet = new Set(selectedIds)
	const hasSelection = selectedIds.length > 0
	const hasCustomRegionClass = !!classNames.region
	const parts: string[] = []

	for (let i = 0; i < features.length; i++) {
		const feature = features[i]
		const d = pathGen(feature.geometry)
		if (!d) continue
		const isSelected = selectedSet.has(feature.id)
		const choroFill = isSelected || hasSelection ? undefined : choro?.fill(feature.id)
		const customClass = hasCustomRegionClass
			? cnFn(classNames.region, {
					feature,
					index: i,
					isSelected,
					isHovered: false,
					value: choro?.valueMap.get(feature.id),
				})
			: ''
		const baseClass = isSelected ? SELECTED_CLASS : UNSELECTED_CLASS
		const cls = customClass ? `${baseClass} ${customClass}` : baseClass
		const style = choroFill ? ` style="fill:${choroFill}"` : ''
		parts.push(`<path data-idx="${i}" d="${d}" class="${cls}"${style} vector-effect="non-scaling-stroke"/>`)
	}

	return parts.join('')
}

const graticuleGenerator = geoGraticule()

const buildGraticuleMarkup = (
	pathGen: ReturnType<typeof buildPathGenerator>,
	classNames: { graticule?: string; sphere?: string },
) => {
	const graticulePath = pathGen(graticuleGenerator())
	const spherePath = pathGen(SPHERE)
	const graticuleClass = cn('fill-none stroke-current/5', classNames.graticule)
	const sphereClass = cn('fill-none stroke-current/5', classNames.sphere)
	return [
		spherePath ? `<path d="${spherePath}" class="${sphereClass}" vector-effect="non-scaling-stroke"/>` : '',
		graticulePath ? `<path d="${graticulePath}" class="${graticuleClass}" vector-effect="non-scaling-stroke"/>` : '',
	].join('')
}

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

const getFeatureIndex = (e: React.MouseEvent): number | null => {
	const target = (e.target as SVGElement).closest('path[data-idx]')
	if (!target) return null
	return Number(target.getAttribute('data-idx'))
}

const buildRegionHandlers = ({
	features,
	tooltipStore,
	choro,
	onRegionClick,
	onRegionMouseEnter,
	onRegionMouseLeave,
}: {
	features: ReturnType<typeof useGeoProjection>['features']
	tooltipStore: TooltipStore
	choro: ChoroData | undefined
	onRegionClick: GeoMapBaseProps['onRegionClick']
	onRegionMouseEnter: GeoMapBaseProps['onRegionMouseEnter']
	onRegionMouseLeave: GeoMapBaseProps['onRegionMouseLeave']
}) => ({
	handleClick: (e: React.MouseEvent) => {
		const idx = getFeatureIndex(e)
		if (idx != null) onRegionClick?.(features[idx], idx)
	},
	handleMouseOver: (e: React.MouseEvent) => {
		const idx = getFeatureIndex(e)
		if (idx == null) return
		const feature = features[idx]
		tooltipStore.show(idx, feature, choro?.valueMap.get(feature.id))
		onRegionMouseEnter?.(feature, idx)
	},
	handleMouseMove: (e: React.MouseEvent) => tooltipStore.setPoint(e.clientX, e.clientY),
	handleMouseOut: (e: React.MouseEvent) => {
		const idx = getFeatureIndex(e)
		if (idx == null) return
		tooltipStore.hide()
		onRegionMouseLeave?.(features[idx], idx)
	},
})

type ZoomControls = {
	zoomIn: () => void
	zoomOut: () => void
	resetZoom: () => void
	canZoomIn: boolean
	canZoomOut: boolean
	canReset: boolean
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
	zoom: ZoomControls
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

export const GeoMapView = ({
	geo,
	projection: projectionProp,
	region,
	draggable,
	zoomable,
	zoom: zoomProp,
	defaultZoom,
	onZoomChange,
	className,
	classNames = EMPTY_OBJ,
	choropleth,
	selectedIds = EMPTY_ARR,
	components = EMPTY_OBJ,
	formatters = EMPTY_OBJ,
	subProps,
	legendTarget,
	zoomTarget,
	onRegionClick,
	onRegionMouseEnter,
	onRegionMouseLeave,
	children,
	...svgProps
}: GeoMapViewProps) => {
	const [rotation, setRotation] = useState<[number, number] | undefined>(undefined)
	const { features, projection, pathGen, dragBehavior, viewBoxW, viewBoxH } = useGeoProjection({
		geo,
		projection: projectionProp,
		region,
		rotation,
	})
	const choro = choropleth ? getChoroData(choropleth) : undefined
	const markup = buildPathMarkup({ features, pathGen, selectedIds, choro, classNames })
	const viewBox = `0 0 ${viewBoxW} ${viewBoxH}`
	const viewBoxCenter: [number, number] = [viewBoxW / 2, viewBoxH / 2]
	const hasSelection = selectedIds.length > 0
	const [tooltipStore] = useState(createTooltipStore)
	const svgRef = useRef<SVGSVGElement>(null)
	const zoomGRef = useRef<SVGGElement>(null)

	const { zoomState, ...zoomControls } = useGeoZoom({
		svgRef,
		zoomGRef,
		viewBoxCenter,
		zoomEnabled: zoomable === true || !!components.zoom,
		dragEnabled: draggable === true,
		dragBehavior,
		projection,
		projectionScale: projection.scale(),
		rotation,
		zoom: zoomProp,
		defaultZoom,
		onRotate: setRotation,
		onZoomChange,
		onDragStart: () => tooltipStore.setSuppressed(true),
		onDragEnd: () => tooltipStore.setSuppressed(false),
		subPropsZoom: subProps?.zoom,
	})

	useEffect(() => {
		zoomControls.resetZoom()
		// eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally only resets when projection changes
	}, [projectionProp])

	const ctxValue = useMemo<GeoMapContextValue>(
		() => ({
			projection,
			pathGenerator: pathGen,
			features,
			width: viewBoxW,
			height: viewBoxH,
			zoom: zoomState,
			selectedIds,
			choropleth: choropleth && choro ? { colorFn: choro.fill, scaleType: choropleth.scaleType ?? 'quantize' } : null,
		}),
		[projection, pathGen, features, viewBoxW, viewBoxH, zoomState, selectedIds, choropleth, choro],
	)

	const { handleClick, handleMouseOver, handleMouseMove, handleMouseOut } = buildRegionHandlers({
		features,
		tooltipStore,
		choro,
		onRegionClick,
		onRegionMouseEnter,
		onRegionMouseLeave,
	})

	const showLegend = !!(components.legend && choropleth && choro?.values.length && !hasSelection)
	const legendItems = showLegend && choro ? buildLegendItems(choro, choropleth) : []

	return (
		<GeoMapContext value={ctxValue}>
			<svg
				ref={svgRef}
				xmlns='http://www.w3.org/2000/svg'
				viewBox={viewBox}
				className={cn('w-full h-auto', className)}
				{...svgProps}
			>
				<g ref={zoomGRef}>
					<GeoMapGraticule pathGen={pathGen} classNames={classNames} component={components.graticule} />
					<g
						onClick={handleClick}
						onMouseOver={handleMouseOver}
						onMouseMove={handleMouseMove}
						onMouseOut={handleMouseOut}
						dangerouslySetInnerHTML={{ __html: markup }}
					/>
					{children}
				</g>
				<SvgPatternDefs />
			</svg>
			<GeoMapOverlays
				tooltipStore={tooltipStore}
				choro={choro}
				selectedIds={selectedIds}
				classNames={classNames}
				formatters={formatters}
				components={components}
				legendItems={legendItems}
				showLegend={showLegend}
				choropleth={choropleth}
				legendTarget={legendTarget}
				zoomTarget={zoomTarget}
				zoom={zoomControls}
			/>
		</GeoMapContext>
	)
}
