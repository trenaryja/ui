import type { ColorMixSpace, FunctionalClassName, Placement } from '@/utils'
import type { GeoGeometryObjects, GeoProjection } from 'd3-geo'
import type { ComponentProps, ComponentType, ReactNode, RefObject } from 'react'
import type { Topology } from 'topojson-specification'

/**
 * A `GeoJSON.Feature` with `id` guaranteed as a string and a top-level `name` field
 * hoisted from properties (`properties.name` or `properties.NAME`). Structurally still
 * a GeoJSON Feature, so it composes with d3-geo functions like `geoPath`, `geoBounds`,
 * and `geoCentroid`.
 *
 * Used as the base shape for all geo primitives (`GeoRegion`, future `GeoPoint`, `GeoLine`).
 */
export type NamedFeature<
	G extends GeoJSON.Geometry | null = GeoJSON.Geometry,
	P extends Record<string, unknown> = Record<string, unknown>,
> = Omit<GeoJSON.Feature<G, P>, 'id'> & {
	id: string
	name: string
}

export type GeoRegion = NamedFeature<GeoJSON.MultiPolygon | GeoJSON.Polygon>

export type GeoPoint = NamedFeature<GeoJSON.MultiPoint | GeoJSON.Point | null, { regionId?: string; value?: number }>

/** `[x, y]` tuple is a 0..1 fraction of the point's 24x24 viewBox. */
export type GeoAnchor = 'center' | Placement | readonly [x: number, y: number]

export type GeoPointState = {
	point: GeoPoint
	index: number
	isSelected: boolean
	isHovered: boolean
	value?: number
}

export type ClusterConfig = {
	/** Cluster radius in pixels. Higher values cluster more aggressively. Default 60. */
	radius?: number
	/** Above this zoom level, points are never clustered. Default Infinity. */
	maxZoom?: number
	/** Minimum points required to form a cluster. Default 2. */
	minPoints?: number
}

export type PointsConfig = {
	data: readonly GeoPoint[]
	size?: ((state: GeoClusterState | GeoPointState) => number) | number
	anchor?: GeoAnchor
	/** When `false` (default), points keep constant pixel size as the user zooms. When `true`, they scale with zoom. */
	scaleWithZoom?: boolean
	cluster?: ClusterConfig | boolean
}

export type ClusteredPoint = GeoPoint & { isSelected: boolean }

export type GeoClusterState = {
	/** Supercluster's cluster id. Used with `supercluster.getClusterExpansionZoom(id)`. */
	id: number
	/** Point count in this cluster. Named by Mapbox convention (matches `properties.point_count`). */
	count: number
	/** `[lon, lat]` of the cluster centroid. */
	coordinates: [number, number]
	/** The underlying points in this cluster. Populated lazily when needed by tooltip/handler. */
	points: readonly ClusteredPoint[]
	isHovered: boolean
}

export const geoProjectionPresets = [
	'azimuthal-equidistant',
	'gnomonic',
	'orthographic',
	'satellite',
	'stereographic',
	'albers-usa',
	'equirectangular',
	'mercator',
	'miller',
	'equal-earth',
	'hammer',
	'kavrayskiy7',
	'mollweide',
	'natural-earth',
	'patterson',
	'robinson',
	'winkel3',
] as const

export type GeoProjectionPreset = (typeof geoProjectionPresets)[number]
export type GeoRegionFilter = ((feature: GeoRegion) => boolean) | string
export type GeoDataSource = string | GeoJSON.FeatureCollection | Topology

export type GeoRegionState = {
	feature: GeoRegion
	index: number
	isSelected: boolean
	isHovered: boolean
	value?: number
}

export const choroplethScaleTypes = ['quantize', 'quantile', 'linear'] as const
export type ChoroplethScaleType = (typeof choroplethScaleTypes)[number]
export type ChoroplethDatum = { id: string; value: number }

export type ChoroplethConfig = {
	data: ChoroplethDatum[]
	scaleType?: ChoroplethScaleType
	steps?: number
	colors?: string[]
	colorSpace?: ColorMixSpace
	valueFormat?: (value: number) => string
}

export type GeoLegendItem = { key: string; color: string; label: string }

export type GeoMapLegendClassNames = {
	container?: string
	item?: FunctionalClassName<GeoLegendItem>
	swatch?: FunctionalClassName<GeoLegendItem>
	label?: FunctionalClassName<GeoLegendItem>
	gradient?: string
}

export type GeoMapLegendFormatters = {
	label?: (label: string, item: GeoLegendItem) => ReactNode
}

export type GeoMapLegendComponents =
	| ComponentType<{ items: GeoLegendItem[]; scaleType: ChoroplethScaleType; colors: string[] }>
	| {
			container?: ComponentType<{ items: GeoLegendItem[]; className?: string; children: ReactNode }>
			item?: ComponentType<{ item: GeoLegendItem; className?: string; children: ReactNode }>
			swatch?: ComponentType<{ item: GeoLegendItem; className?: string }>
	  }

export type GeoTooltipState =
	| (GeoClusterState & { kind: 'cluster' })
	| (GeoPointState & { kind: 'point' })
	| (GeoRegionState & { kind: 'region' })

export type GeoMapTooltipClassNames = {
	container?: FunctionalClassName<GeoTooltipState>
	title?: FunctionalClassName<GeoTooltipState>
	swatch?: FunctionalClassName<GeoTooltipState>
	label?: FunctionalClassName<GeoTooltipState>
	value?: FunctionalClassName<GeoTooltipState>
}

export type GeoMapTooltipFormatters = {
	title?: (state: GeoTooltipState) => ReactNode
	value?: (value: number, state: GeoTooltipState) => ReactNode
	label?: (state: GeoTooltipState) => ReactNode
}

export type GeoMapTooltipComponents =
	| ComponentType<{ state: GeoTooltipState; color?: string }>
	| {
			container?: ComponentType<{ state: GeoTooltipState; className?: string; children: ReactNode }>
			swatch?: ComponentType<{ state: GeoTooltipState; color?: string; className?: string }>
	  }

export type GeoMapGraticuleComponents = ComponentType<{
	pathGenerator: (obj: GeoGeometryObjects) => string | null
}>

export type GeoMapZoomControlsComponents = ComponentType<{
	zoomIn: () => void
	zoomOut: () => void
	resetZoom: () => void
	canZoomIn: boolean
	canZoomOut: boolean
	canReset: boolean
}>

export type GeoMapComponents = {
	graticule?: boolean | GeoMapGraticuleComponents
	tooltip?: boolean | GeoMapTooltipComponents
	legend?: boolean | GeoMapLegendComponents
	zoom?: boolean | GeoMapZoomControlsComponents
}

export type GeoMapFormatters = {
	tooltip?: GeoMapTooltipFormatters
	legend?: GeoMapLegendFormatters
}

export type GeoMapClassNames = {
	region?: FunctionalClassName<GeoRegionState>
	point?: FunctionalClassName<GeoPointState>
	cluster?: FunctionalClassName<GeoClusterState>
	graticule?: string
	sphere?: string
	tooltip?: GeoMapTooltipClassNames
	legend?: GeoMapLegendClassNames
	zoom?: string
}

export type GeoMapSubProps = {
	zoom?: Record<string, unknown>
}

export type GeoZoomState = {
	scale: number
	/** [longitude, latitude] of the viewport center. */
	center: [number, number]
}

export type FormInputConfig =
	| {
			mode: 'multi'
			value?: readonly string[]
			defaultValue?: readonly string[]
			onChange?: (ids: string[]) => void
			name?: string
	  }
	| {
			mode: 'single'
			value?: string | null
			defaultValue?: string | null
			onChange?: (id: string | null) => void
			name?: string
	  }

export type GeoMapBaseProps = Omit<ComponentProps<'svg'>, 'onChange' | 'points'> & {
	geo?: GeoDataSource
	projection?: ((width: number, height: number) => GeoProjection) | GeoProjectionPreset
	region?: GeoRegionFilter
	draggable?: boolean
	zoomable?: boolean
	zoom?: GeoZoomState
	defaultZoom?: GeoZoomState
	onZoomChange?: (zoom: GeoZoomState | undefined) => void
	regionFormInput?: FormInputConfig
	pointFormInput?: FormInputConfig
	points?: PointsConfig
	className?: string
	classNames?: GeoMapClassNames
	choropleth?: ChoroplethConfig
	components?: GeoMapComponents
	formatters?: GeoMapFormatters
	subProps?: GeoMapSubProps
	legendTarget?: RefObject<HTMLElement | null>
	zoomTarget?: RefObject<HTMLElement | null>
	onRegionClick?: (feature: GeoRegion, index: number) => void
	onRegionMouseEnter?: (feature: GeoRegion, index: number) => void
	onRegionMouseLeave?: (feature: GeoRegion, index: number) => void
	onPointClick?: (point: GeoPoint, index: number) => void
	onPointMouseEnter?: (point: GeoPoint, index: number) => void
	onPointMouseLeave?: (point: GeoPoint, index: number) => void
	/**
	 * Called when a cluster is clicked. If omitted, the default behavior is to zoom to the
	 * cluster's expansion zoom level (so the cluster breaks apart).
	 */
	onClusterClick?: (state: GeoClusterState) => void
	onClusterMouseEnter?: (state: GeoClusterState) => void
	onClusterMouseLeave?: (state: GeoClusterState) => void
	children?: ReactNode
}
