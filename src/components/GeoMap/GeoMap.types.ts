import type { SvgGeoMapLocation, SvgGeoMapName } from '@/data/svg-geo-maps'
import type { ColorMixSpace, FunctionalClassName } from '@/utils'
import type { ComponentProps, ComponentType, ReactNode, RefObject } from 'react'

export type GeoRegionState = {
	location: SvgGeoMapLocation
	index: number
	isSelected: boolean
	isHovered: boolean
	value?: number
}

export const choroplethScaleTypes = ['quantize', 'quantile', 'linear'] as const
export type ChoroplethScaleType = (typeof choroplethScaleTypes)[number]

export type ChoroplethDatum = {
	id: SvgGeoMapLocation['id']
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
	map: SvgGeoMapName
	className?: string
	classNames?: GeoMapClassNames
	choropleth?: ChoroplethConfig
	components?: GeoMapComponents
	formatters?: GeoMapFormatters
	legendTarget?: RefObject<HTMLElement | null>
	onRegionClick?: (location: SvgGeoMapLocation, index: number) => void
	onRegionMouseEnter?: (location: SvgGeoMapLocation, index: number) => void
	onRegionMouseLeave?: (location: SvgGeoMapLocation, index: number) => void
	children?: ReactNode
}
