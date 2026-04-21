'use client'

import { cn, cnFn, EMPTY_ARR, EMPTY_OBJ } from '@/utils'
import type { GeoGeometryObjects, GeoPath, GeoPermissibleObjects, GeoProjection } from 'd3-geo'
import { geoGraticule } from 'd3-geo'
import { createContext, use, useEffect, useMemo, useRef, useState } from 'react'
import type { ChoroplethScaleType, GeoDataSource, GeoFeature, GeoMapBaseProps, GeoZoomState } from '../GeoMap.types'
import type { buildPathGenerator, ChoroData, GeoMapPreset } from '../GeoMap.utils'
import {
	buildLegendItems,
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
import { useGeoZoom } from './useGeoZoom'

export type GeoMapContextValue = {
	projection: GeoProjection
	pathGenerator: GeoPath<unknown, GeoPermissibleObjects>
	features: readonly GeoFeature[]
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

const urlCache = new Map<string, Promise<GeoFeature[]>>()
const presetCache = new Map<GeoMapPreset, Promise<GeoFeature[]>>()

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

export type GeoMapViewProps = GeoMapBaseProps & { selectedIds?: readonly string[] }

const useGeoProjection = (
	props: Pick<GeoMapBaseProps, 'geo' | 'projection' | 'region'> & { rotation?: [number, number] },
) => {
	const { features: allFeatures } = useGeoData(props.geo)
	const features = props.region ? filterFeatures(allFeatures, props.region) : allFeatures
	const projection =
		props.projection ??
		(typeof props.geo === 'string' && isGeoMapPreset(props.geo) ? defaultProjectionForPreset(props.geo) : undefined)
	return { features, ...fitProjection({ features, projection, rotation: props.rotation, viewBoxW: VIEWBOX_W }) }
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
	features: Features
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
		components: componentsProp,
		formatters: formattersProp,
		subProps,
		legendTarget,
		zoomTarget,
		onRegionClick,
		onRegionMouseEnter,
		onRegionMouseLeave,
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

	const choro = useMemo(() => (choropleth ? getChoroData(choropleth) : undefined), [choropleth])
	const markup = useMemo(
		() => buildPathMarkup({ features, pathGen, selectedIds, choro, classNames }),
		[features, pathGen, selectedIds, choro, classNames],
	)

	const viewBox = `0 0 ${viewBoxW} ${viewBoxH}`
	const viewBoxCenter: [number, number] = [viewBoxW / 2, viewBoxH / 2]
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

	const handlers = buildRegionHandlers({
		features,
		tooltipStore,
		choro,
		onRegionClick,
		onRegionMouseEnter,
		onRegionMouseLeave,
	})

	const showLegend = !!(components.legend && choropleth && choro?.values.length && !selectedIds.length)
	const legendItems = showLegend && choro ? buildLegendItems(choro, choropleth) : []

	return {
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
		overlayProps: {
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
			zoom: zoomControls,
		},
	}
}
