import type { ColorMixSpace, FunctionalClassName } from '@/utils'
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

export type GeoMapTooltipClassNames = {
	container?: FunctionalClassName<GeoRegionState>
	title?: FunctionalClassName<GeoRegionState>
	swatch?: FunctionalClassName<GeoRegionState>
	label?: FunctionalClassName<GeoRegionState>
	value?: FunctionalClassName<GeoRegionState>
}

export type GeoMapTooltipFormatters = {
	title?: (state: GeoRegionState) => ReactNode
	value?: (value: number, state: GeoRegionState) => ReactNode
	label?: (state: GeoRegionState) => ReactNode
}

export type GeoMapTooltipComponents =
	| ComponentType<{ state: GeoRegionState; color?: string }>
	| {
			container?: ComponentType<{ state: GeoRegionState; className?: string; children: ReactNode }>
			swatch?: ComponentType<{ state: GeoRegionState; color?: string; className?: string }>
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

export type GeoMapBaseProps = Omit<ComponentProps<'svg'>, 'onChange'> & {
	geo?: GeoDataSource
	projection?: ((width: number, height: number) => GeoProjection) | GeoProjectionPreset
	region?: GeoRegionFilter
	draggable?: boolean
	zoomable?: boolean
	zoom?: GeoZoomState
	defaultZoom?: GeoZoomState
	onZoomChange?: (zoom: GeoZoomState | undefined) => void
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
	children?: ReactNode
}
