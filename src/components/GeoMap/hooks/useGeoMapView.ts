'use client'

import { cn, cnFn, EMPTY_ARR, EMPTY_OBJ } from '@/utils'
import type { GeoGeometryObjects, GeoPath, GeoPermissibleObjects, GeoProjection } from 'd3-geo'
import { geoGraticule } from 'd3-geo'
import { createContext, use, useEffect, useMemo, useRef, useState } from 'react'
import type {
	ChoroplethConfig,
	ChoroplethScaleType,
	ClusterConfig,
	GeoClusterState,
	GeoDataSource,
	GeoMapBaseProps,
	GeoRegion,
	GeoTooltipState,
	GeoZoomState,
	PointsConfig,
} from '../GeoMap.types'
import type { ClusterIndex, ClusterItem } from '../GeoMap.cluster.utils'
import { buildClusterIndex, queryClusterItems, scaleToZoomLevel } from '../GeoMap.cluster.utils'
import { buildPointsMarkup } from '../GeoMap.points.utils'
import type { buildPathGenerator, ChoroData, GeoMapPreset } from '../GeoMap.utils'
import {
	animateZoom,
	buildLegendItems,
	computeViewportBbox,
	defaultProjectionForPreset,
	filterFeatures,
	fitProjection,
	getChoroData,
	isGeoMapPreset,
	loadPresetFeatures,
	resolveGeoData,
} from '../GeoMap.utils'
import type { TooltipStore } from './useGeoMapTooltip'
import { createTooltipStore } from './useGeoMapTooltip'
import { GEOMAP_MAX_SCALE, useGeoZoom } from './useGeoZoom'
import { usePinCounterScale } from './usePinCounterScale'

export type GeoMapContextValue = {
	projection: GeoProjection
	pathGenerator: GeoPath<unknown, GeoPermissibleObjects>
	/** Typed wrapper over `projection(coords)`. Returns `null` if the point can't be projected (e.g., clipped). */
	project: (coords: [number, number]) => [number, number] | null
	features: readonly GeoRegion[]
	width: number
	height: number
	zoom: GeoZoomState | undefined
	selectedIds: readonly string[]
	choropleth: { colorFn: (featureId: string) => string | undefined; scaleType: ChoroplethScaleType } | null
}

export const GeoMapContext = createContext<GeoMapContextValue | null>(null)

export const useGeoMap = () => {
	const ctx = use(GeoMapContext)
	if (!ctx) throw new Error('useGeoMap must be used within a <GeoMap> component')
	return ctx
}

const urlCache = new Map<string, Promise<GeoRegion[]>>()
const presetCache = new Map<GeoMapPreset, Promise<GeoRegion[]>>()

const getUrlPromise = (url: string) => {
	const cached = urlCache.get(url)
	if (cached) return cached
	const promise = fetch(url)
		.then((res) => {
			if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
			return res.json()
		})
		.then((data) => resolveGeoData(data))
	urlCache.set(url, promise)
	return promise
}

const getPresetPromise = (preset: GeoMapPreset) => {
	const cached = presetCache.get(preset)
	if (cached) return cached
	const promise = loadPresetFeatures(preset)
	presetCache.set(preset, promise)
	return promise
}

const useGeoData = (geo: GeoDataSource | undefined) => {
	if (geo === undefined || (typeof geo === 'string' && isGeoMapPreset(geo)))
		return { features: use(getPresetPromise(geo ?? 'world')) }
	if (typeof geo === 'string') return { features: use(getUrlPromise(geo)) }
	return { features: resolveGeoData(geo) }
}

const VIEWBOX_W = 1000
const SPHERE: GeoGeometryObjects = { type: 'Sphere' }
const graticuleGenerator = geoGraticule()

const UNSELECTED_CLASS = cn(
	'stroke-base-content/20',
	'hover:stroke-base-content hover:z-10',
	'fill-base-100',
	'hover:fill-base-300',
)
const SELECTED_CLASS = cn('stroke-base-content/20', 'hover:stroke-base-content hover:z-10', 'fill-base-content')

export type GeoMapViewProps = GeoMapBaseProps & {
	selectedIds?: readonly string[]
	selectedPointIds?: readonly string[]
}

/** Resolve `points.cluster` to a stable config object or `null` (disabled). */
const useClusterConfig = (points: PointsConfig | undefined): ClusterConfig | null => {
	const raw = points?.cluster
	const radius = typeof raw === 'object' ? raw.radius : undefined
	const maxZoom = typeof raw === 'object' ? raw.maxZoom : undefined
	const minPoints = typeof raw === 'object' ? raw.minPoints : undefined
	return useMemo(() => {
		if (!raw) return null
		if (raw === true) return {}
		return { radius, maxZoom, minPoints }
	}, [raw, radius, maxZoom, minPoints])
}

/** Query clusters at the current zoom level. Memoized on zoom level (integer) and viewport bbox. */
const useClusterItems = ({
	index,
	zoomLevel,
	points,
	selectedPointIds,
	bbox,
}: {
	index: ClusterIndex | null
	zoomLevel: number
	points: readonly PointsConfig['data'][number][] | undefined
	selectedPointIds: readonly string[]
	bbox: [number, number, number, number]
}): ClusterItem[] | undefined =>
	useMemo(() => {
		if (!index || !points) return undefined
		return queryClusterItems({ index, zoomLevel, points, selectedPointIds, bbox })
		// eslint-disable-next-line react-hooks/exhaustive-deps -- bbox tuple compared by value via .join for stable memo across re-renders
	}, [index, zoomLevel, points, selectedPointIds, bbox.join(',')])

/**
 * Narrow deps to choropleth's inner fields so a new `{ data, scaleType, ... }` literal per render
 * doesn't invalidate `choro` (which would cascade into `markup` rebuilds — 3200 paths for us-counties).
 */
const useChoroData = (choropleth: ChoroplethConfig | undefined) => {
	const data = choropleth?.data
	const scaleType = choropleth?.scaleType
	const steps = choropleth?.steps
	const colors = choropleth?.colors
	const colorSpace = choropleth?.colorSpace
	return useMemo(
		() => (data ? getChoroData({ data, scaleType, steps, colors, colorSpace }) : undefined),
		[data, scaleType, steps, colors, colorSpace],
	)
}

const useGeoProjection = (
	props: Pick<GeoMapBaseProps, 'geo' | 'projection' | 'region'> & { rotation?: [number, number] },
) => {
	const { features: allFeatures } = useGeoData(props.geo)
	// Memoize so fitProjection doesn't mint a new projection every render. Stable projection ref
	// keeps pointsMarkup's useMemo stable during pure zoom — React skips the innerHTML update,
	// which is what lets onZoomApplied's imperative counter-scale patch persist across ticks.
	const rotX = props.rotation?.[0]
	const rotY = props.rotation?.[1]
	return useMemo(() => {
		const features = props.region ? filterFeatures(allFeatures, props.region) : allFeatures
		const projectionInput =
			props.projection ??
			(typeof props.geo === 'string' && isGeoMapPreset(props.geo) ? defaultProjectionForPreset(props.geo) : undefined)
		const rotation: [number, number] | undefined = rotX !== undefined && rotY !== undefined ? [rotX, rotY] : undefined
		return {
			features,
			...fitProjection({ features, projection: projectionInput, rotation, viewBoxW: VIEWBOX_W }),
		}
	}, [allFeatures, props.region, props.projection, props.geo, rotX, rotY])
}

type Features = ReturnType<typeof useGeoProjection>['features']

type PathGen = ReturnType<typeof buildPathGenerator>

const buildPathMarkup = ({
	features,
	pathGen,
	selectedIds,
	choro,
	classNames,
}: {
	features: Features
	pathGen: PathGen
	selectedIds: readonly string[]
	choro: ChoroData | undefined
	classNames: NonNullable<GeoMapBaseProps['classNames']>
}) => {
	const selectedSet = new Set(selectedIds)
	const hasSelection = selectedIds.length > 0
	const parts: string[] = []

	for (let i = 0; i < features.length; i++) {
		const feature = features[i]
		const d = pathGen(feature.geometry)
		if (!d) continue
		const isSelected = selectedSet.has(feature.id)
		const choroFill = isSelected || hasSelection ? undefined : choro?.fill(feature.id)
		const customClass = classNames.region
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

export const buildGraticuleMarkup = (pathGen: PathGen, classNames: { graticule?: string; sphere?: string }) => {
	const graticulePath = pathGen(graticuleGenerator())
	const spherePath = pathGen(SPHERE)
	const graticuleClass = cn('fill-none stroke-current/5', classNames.graticule)
	const sphereClass = cn('fill-none stroke-current/5', classNames.sphere)
	return [
		spherePath ? `<path d="${spherePath}" class="${sphereClass}" vector-effect="non-scaling-stroke"/>` : '',
		graticulePath ? `<path d="${graticulePath}" class="${graticuleClass}" vector-effect="non-scaling-stroke"/>` : '',
	].join('')
}

const getRegionTarget = (e: React.MouseEvent) => {
	const target = (e.target as SVGElement).closest('path[data-idx]')
	if (!target) return null
	return { target, idx: Number(target.getAttribute('data-idx')) }
}

const getPointTarget = (e: React.MouseEvent) => {
	const target = (e.target as SVGElement).closest('path[data-point-idx]')
	if (!target) return null
	return { target, idx: Number(target.getAttribute('data-point-idx')) }
}

const getClusterTarget = (e: React.MouseEvent) => {
	const target = (e.target as SVGElement).closest('g[data-cluster-idx]')
	if (!target) return null
	return { target, idx: Number(target.getAttribute('data-cluster-idx')) }
}

const clusterItemToState = (item: Extract<ClusterItem, { kind: 'cluster' }>): GeoClusterState => ({
	id: item.id,
	count: item.count,
	coordinates: item.coords,
	points: item.getPoints(),
	isHovered: true,
})

type PointHandlerCtx = {
	points: PointsConfig | undefined
	clusterItems: readonly ClusterItem[] | undefined
	tooltipStore: TooltipStore
	selectedPointIds: readonly string[]
	onPointClick: GeoMapBaseProps['onPointClick']
	onPointMouseEnter: GeoMapBaseProps['onPointMouseEnter']
	onPointMouseLeave: GeoMapBaseProps['onPointMouseLeave']
	onClusterClick: GeoMapBaseProps['onClusterClick']
	onClusterMouseEnter: GeoMapBaseProps['onClusterMouseEnter']
	onClusterMouseLeave: GeoMapBaseProps['onClusterMouseLeave']
}

const getClusterAt = (ctx: PointHandlerCtx, idx: number) => {
	const item = ctx.clusterItems?.[idx]
	return item && item.kind === 'cluster' ? item : null
}

const pointTooltipState = (ctx: PointHandlerCtx, idx: number): GeoTooltipState => {
	const point = (ctx.points?.data ?? EMPTY_ARR)[idx]
	return {
		kind: 'point',
		point,
		index: idx,
		isSelected: ctx.selectedPointIds.includes(point.id),
		isHovered: true,
		value: point.properties.value,
	}
}

const handlePointerClick = (ctx: PointHandlerCtx, e: React.MouseEvent) => {
	const c = getClusterTarget(e)

	if (c) {
		const cluster = getClusterAt(ctx, c.idx)
		if (cluster) ctx.onClusterClick?.(clusterItemToState(cluster))
		return
	}

	const t = getPointTarget(e)
	if (t) ctx.onPointClick?.((ctx.points?.data ?? EMPTY_ARR)[t.idx], t.idx)
}

const handlePointerOver = (ctx: PointHandlerCtx, e: React.MouseEvent) => {
	const c = getClusterTarget(e)

	if (c) {
		const cluster = getClusterAt(ctx, c.idx)
		if (!cluster) return
		const state = clusterItemToState(cluster)
		ctx.tooltipStore.show({ ...state, kind: 'cluster' })
		ctx.onClusterMouseEnter?.(state)
		return
	}

	const t = getPointTarget(e)
	if (!t) return
	ctx.tooltipStore.show(pointTooltipState(ctx, t.idx))
	ctx.onPointMouseEnter?.((ctx.points?.data ?? EMPTY_ARR)[t.idx], t.idx)
}

const handlePointerOut = (ctx: PointHandlerCtx, e: React.MouseEvent) => {
	const c = getClusterTarget(e)

	if (c) {
		const cluster = getClusterAt(ctx, c.idx)
		if (!cluster) return
		ctx.tooltipStore.hide()
		ctx.onClusterMouseLeave?.(clusterItemToState(cluster))
		return
	}

	const t = getPointTarget(e)
	if (!t) return
	ctx.tooltipStore.hide()
	ctx.onPointMouseLeave?.((ctx.points?.data ?? EMPTY_ARR)[t.idx], t.idx)
}

const buildPointHandlers = (ctx: PointHandlerCtx) => ({
	handleClick: (e: React.MouseEvent) => handlePointerClick(ctx, e),
	handleMouseOver: (e: React.MouseEvent) => handlePointerOver(ctx, e),
	handleMouseMove: (e: React.MouseEvent) => ctx.tooltipStore.setPoint(e.clientX, e.clientY),
	handleMouseOut: (e: React.MouseEvent) => handlePointerOut(ctx, e),
})

const buildRegionHandlers = ({
	features,
	tooltipStore,
	choro,
	selectedIds,
	classNames,
	onRegionClick,
	onRegionMouseEnter,
	onRegionMouseLeave,
}: {
	features: Features
	tooltipStore: TooltipStore
	choro: ChoroData | undefined
	selectedIds: readonly string[]
	classNames: NonNullable<GeoMapBaseProps['classNames']>
	onRegionClick: GeoMapBaseProps['onRegionClick']
	onRegionMouseEnter: GeoMapBaseProps['onRegionMouseEnter']
	onRegionMouseLeave: GeoMapBaseProps['onRegionMouseLeave']
}) => {
	// Repaint the hovered path's class with `isHovered: true` so functional
	// `classNames.region` consumers see the live hover state. innerHTML markup
	// is built once with isHovered=false; we patch imperatively to avoid a re-render.
	const setHoverClass = (target: Element, idx: number, isHovered: boolean) => {
		if (typeof classNames.region !== 'function') return
		const feature = features[idx]
		const isSelected = selectedIds.includes(feature.id)
		const customClass = cnFn(classNames.region, {
			feature,
			index: idx,
			isSelected,
			isHovered,
			value: choro?.valueMap.get(feature.id),
		})
		const baseClass = isSelected ? SELECTED_CLASS : UNSELECTED_CLASS
		target.setAttribute('class', customClass ? `${baseClass} ${customClass}` : baseClass)
	}

	return {
		handleClick: (e: React.MouseEvent) => {
			const t = getRegionTarget(e)
			if (t) onRegionClick?.(features[t.idx], t.idx)
		},
		handleMouseOver: (e: React.MouseEvent) => {
			const t = getRegionTarget(e)
			if (!t) return
			const feature = features[t.idx]
			const isSelected = selectedIds.includes(feature.id)
			setHoverClass(t.target, t.idx, true)
			tooltipStore.show({
				kind: 'region',
				feature,
				index: t.idx,
				isSelected,
				isHovered: true,
				value: choro?.valueMap.get(feature.id),
			})
			onRegionMouseEnter?.(feature, t.idx)
		},
		handleMouseMove: (e: React.MouseEvent) => tooltipStore.setPoint(e.clientX, e.clientY),
		handleMouseOut: (e: React.MouseEvent) => {
			const t = getRegionTarget(e)
			if (!t) return
			setHoverClass(t.target, t.idx, false)
			tooltipStore.hide()
			onRegionMouseLeave?.(features[t.idx], t.idx)
		},
	}
}

// eslint-disable-next-line max-lines-per-function, complexity -- orchestrates the full GeoMap view: projection, zoom, tooltip, selection, handlers, and overlays
export const useGeoMapView = (props: GeoMapViewProps) => {
	const {
		geo,
		projection: projectionProp,
		region,
		draggable,
		zoomable,
		zoom: zoomProp,
		defaultZoom,
		onZoomChange,
		classNames: classNamesProp,
		choropleth,
		selectedIds = EMPTY_ARR,
		selectedPointIds = EMPTY_ARR,
		components: componentsProp,
		formatters: formattersProp,
		subProps,
		legendTarget,
		zoomTarget,
		points,
		onRegionClick,
		onRegionMouseEnter,
		onRegionMouseLeave,
		onPointClick,
		onPointMouseEnter,
		onPointMouseLeave,
		onClusterClick,
		onClusterMouseEnter,
		onClusterMouseLeave,
		...svgProps
	} = props

	const classNames: NonNullable<GeoMapViewProps['classNames']> = classNamesProp ?? EMPTY_OBJ
	const components: NonNullable<GeoMapViewProps['components']> = componentsProp ?? EMPTY_OBJ
	const formatters: NonNullable<GeoMapViewProps['formatters']> = formattersProp ?? EMPTY_OBJ
	const [rotation, setRotation] = useState<[number, number] | undefined>(undefined)
	const { features, projection, pathGen, dragBehavior, viewBoxW, viewBoxH } = useGeoProjection({
		geo,
		projection: projectionProp,
		region,
		rotation,
	})

	const choro = useChoroData(choropleth)
	const markup = useMemo(
		() => buildPathMarkup({ features, pathGen, selectedIds, choro, classNames }),
		// Narrow dep so a new `classNames` object literal per render doesn't force a rebuild of
		// thousands of region paths (us-counties is ~3200).
		// eslint-disable-next-line react-hooks/exhaustive-deps -- classNames read at compute time; only region sub-key matters here
		[features, pathGen, selectedIds, choro, classNames.region],
	)
	const clusterConfig = useClusterConfig(points)
	const clusterIndex = useMemo(
		() => (clusterConfig && points?.data.length ? buildClusterIndex(points.data, features, clusterConfig) : null),
		[clusterConfig, points?.data, features],
	)
	const zoomLevel = scaleToZoomLevel(zoomProp?.scale ?? 1)
	const viewportBbox = computeViewportBbox({ projection, zoom: zoomProp, viewBoxW, viewBoxH })
	const clusterItems = useClusterItems({
		index: clusterIndex,
		zoomLevel,
		points: points?.data,
		selectedPointIds,
		bbox: viewportBbox,
	})
	const pointsMarkup = useMemo(
		() =>
			buildPointsMarkup({
				config: points,
				projection,
				pathGen,
				regions: features,
				classNames,
				selectedPointIds,
				clusterItems,
			}),
		// eslint-disable-next-line react-hooks/exhaustive-deps -- classNames read at compute time; only point/cluster sub-keys matter here
		[points, projection, pathGen, features, classNames.point, classNames.cluster, selectedPointIds, clusterItems],
	)

	const viewBox = `0 0 ${viewBoxW} ${viewBoxH}`
	const viewBoxCenter: [number, number] = [viewBoxW / 2, viewBoxH / 2]
	const [tooltipStore] = useState(createTooltipStore)
	const svgRef = useRef<SVGSVGElement>(null)
	const zoomGRef = useRef<SVGGElement>(null)
	const pins = usePinCounterScale({ svgRef, scaleWithZoom: points?.scaleWithZoom })

	const { zoomState, setZoom, ...zoomControls } = useGeoZoom({
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
		onZoomApplied: pins.onZoomApplied,
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
			project: (coords) => projection(coords),
			features,
			width: viewBoxW,
			height: viewBoxH,
			zoom: zoomState,
			selectedIds,
			choropleth: choropleth && choro ? { colorFn: choro.fill, scaleType: choropleth.scaleType ?? 'quantize' } : null,
		}),
		[projection, pathGen, features, viewBoxW, viewBoxH, zoomState, selectedIds, choropleth, choro],
	)

	const handlers = buildRegionHandlers({
		features,
		tooltipStore,
		choro,
		selectedIds,
		classNames,
		onRegionClick,
		onRegionMouseEnter,
		onRegionMouseLeave,
	})

	const defaultClusterClick = (state: GeoClusterState) => {
		const expansionZoom = clusterIndex?.getClusterExpansionZoom(state.id) ?? zoomLevel + 2
		const targetScale = Math.min(2 ** expansionZoom, GEOMAP_MAX_SCALE)
		animateZoom({ from: zoomState, to: { scale: targetScale, center: state.coordinates }, onUpdate: setZoom })
	}

	const pointHandlers = buildPointHandlers({
		points,
		clusterItems,
		tooltipStore,
		selectedPointIds,
		onPointClick,
		onPointMouseEnter,
		onPointMouseLeave,
		onClusterClick: onClusterClick ?? defaultClusterClick,
		onClusterMouseEnter,
		onClusterMouseLeave,
	})

	const showLegend = !!(components.legend && choropleth && choro?.values.length && !selectedIds.length)
	const legendItems = showLegend && choro ? buildLegendItems(choro, choropleth) : []

	return {
		svgRef,
		zoomGRef,
		pointsGRef: pins.ref,
		ctxValue,
		viewBox,
		markup,
		pointsMarkup,
		pathGen,
		handlers,
		pointHandlers,
		svgProps,
		classNames,
		components,
		overlayProps: {
			tooltipStore,
			choro,
			classNames,
			formatters,
			components,
			legendItems,
			showLegend,
			choropleth,
			legendTarget,
			zoomTarget,
			zoom: zoomControls,
		},
	}
}
