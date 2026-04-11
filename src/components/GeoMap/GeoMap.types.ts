import type { ColorMixSpace, FunctionalClassName } from '@/utils'
import type { GeoProjection } from 'd3-geo'
import type { ComponentProps, ComponentType, ReactNode, RefObject } from 'react'
import type { Topology } from 'topojson-specification'

// ---------------------------------------------------------------------------
// Geo Feature
// ---------------------------------------------------------------------------

export type GeoFeature = {
	id: string
	name: string
	geometry: GeoJSON.Geometry
	properties: Record<string, unknown>
}

// ---------------------------------------------------------------------------
// Projections
// ---------------------------------------------------------------------------

// prettier-ignore
export const geoProjectionPresets = [
	// d3-geo built-ins
	'albers-usa', 'azimuthal-equidistant', 'conic-conformal', 'conic-equidistant',
	'equal-earth', 'equirectangular', 'gnomonic', 'mercator', 'natural-earth',
	'orthographic', 'stereographic', 'transverse-mercator',
	// d3-geo-projection
	'airy', 'aitoff', 'armadillo', 'august', 'baker', 'berghaus', 'bertin1953',
	'boggs', 'bonne', 'bottomley', 'bromley', 'collignon', 'craster',
	'cylindrical-equal-area', 'cylindrical-stereographic',
	'eckert1', 'eckert2', 'eckert3', 'eckert4', 'eckert5', 'eckert6',
	'eisenlohr', 'fahey', 'gilbert', 'gingery', 'ginzburg4', 'ginzburg5',
	'ginzburg6', 'ginzburg8', 'ginzburg9', 'gringorten', 'hammer', 'healpix',
	'hill', 'homolosine', 'hufnagel',
	'interrupted-boggs', 'interrupted-homolosine', 'interrupted-mollweide',
	'interrupted-mollweide-hemispheres', 'interrupted-sinu-mollweide',
	'interrupted-sinusoidal',
	'kavrayskiy7', 'lagrange', 'larrivee', 'laskowski', 'loximuthal',
	'miller', 'mollweide', 'mt-flat-polar-parabolic', 'mt-flat-polar-quartic',
	'mt-flat-polar-sinusoidal', 'natural-earth2', 'nell-hammer', 'nicolosi',
	'patterson', 'polyconic', 'rectangular-polyconic', 'robinson', 'satellite',
	'sinu-mollweide', 'sinusoidal', 'times', 'van-der-grinten', 'van-der-grinten2',
	'van-der-grinten3', 'van-der-grinten4', 'wagner4', 'wagner6', 'wagner7',
	'wiechel', 'winkel3',
] as const

export type GeoProjectionPreset = (typeof geoProjectionPresets)[number]

// ---------------------------------------------------------------------------
// Region filtering
// ---------------------------------------------------------------------------

export type GeoRegionFilter = ((feature: GeoFeature) => boolean) | string

// ---------------------------------------------------------------------------
// Geo data source
// ---------------------------------------------------------------------------

export type GeoDataSource = string | GeoJSON.FeatureCollection | Topology

// ---------------------------------------------------------------------------
// Region state
// ---------------------------------------------------------------------------

export type GeoRegionState = {
	feature: GeoFeature
	index: number
	isSelected: boolean
	isHovered: boolean
	value?: number
}

// ---------------------------------------------------------------------------
// Choropleth
// ---------------------------------------------------------------------------

export const choroplethScaleTypes = ['quantize', 'quantile', 'linear'] as const
export type ChoroplethScaleType = (typeof choroplethScaleTypes)[number]

export type ChoroplethDatum = {
	id: string
	value: number
}

export type ChoroplethConfig = {
	data: ChoroplethDatum[]
	scaleType?: ChoroplethScaleType
	steps?: number
	colors?: string[]
	colorSpace?: ColorMixSpace

	valueFormat?: (value: number) => string
}

export const geoMapVariants = ['default', 'multi-select', 'single-select'] as const
export type GeoMapVariant = (typeof geoMapVariants)[number]

// ---------------------------------------------------------------------------
// Legend
// ---------------------------------------------------------------------------

export type GeoLegendItem = {
	key: string
	color: string
	label: string
}

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

// ---------------------------------------------------------------------------
// Tooltip
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Composite
// ---------------------------------------------------------------------------

export type GeoMapComponents = {
	tooltip?: boolean | GeoMapTooltipComponents
	legend?: boolean | GeoMapLegendComponents
}

export type GeoMapFormatters = {
	tooltip?: GeoMapTooltipFormatters
	legend?: GeoMapLegendFormatters
}

export type GeoMapClassNames = {
	region?: FunctionalClassName<GeoRegionState>
	tooltip?: GeoMapTooltipClassNames
	legend?: GeoMapLegendClassNames
}

export type GeoMapBaseProps = Omit<ComponentProps<'svg'>, 'onChange'> & {
	geo?: GeoDataSource
	projection?: ((width: number, height: number) => GeoProjection) | GeoProjectionPreset
	region?: GeoRegionFilter
	className?: string
	classNames?: GeoMapClassNames
	choropleth?: ChoroplethConfig
	components?: GeoMapComponents
	formatters?: GeoMapFormatters
	legendTarget?: RefObject<HTMLElement | null>
	onRegionClick?: (feature: GeoFeature, index: number) => void
	onRegionMouseEnter?: (feature: GeoFeature, index: number) => void
	onRegionMouseLeave?: (feature: GeoFeature, index: number) => void
	children?: ReactNode
}
