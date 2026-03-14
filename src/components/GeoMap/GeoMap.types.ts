import type { Placement as FloatingPlacement } from '@floating-ui/react'
import type { SvgGeoMapLocation, SvgGeoMapName } from '@/data/svg-geo-maps'
import type { ComponentProps } from 'react'
import type { FunctionalClassName } from '@/utils'
import type { Placement } from '@/utils'
import type { GeoMapTooltipProps } from './GeoMapTooltip'

export const DEFAULT_ZERO_COLOR = 'var(--color-base-300)'

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

export type ChoroplethLegendConfig = {
	placement?: Placement
	vertical?: boolean
}

export type ChoroplethConfig = {
	data: ChoroplethDatum[]
	scaleType?: ChoroplethScaleType
	steps?: number
	minColor?: string
	maxColor?: string
	zeroColor?: string | false
	legend?: ChoroplethLegendConfig
}

export const geoMapVariants = ['static', 'multi-select', 'single-select'] as const
export type GeoMapVariant = (typeof geoMapVariants)[number]

export type GeoMapClassNames = {
	region?: FunctionalClassName<GeoRegionState>
	selectedRegion?: string
	hoveredRegion?: string
	zeroRegion?: string
}

export type GeoMapBaseProps = Omit<ComponentProps<'svg'>, 'onChange'> & {
	map: SvgGeoMapName
	className?: string
	classNames?: GeoMapClassNames
	choropleth?: ChoroplethConfig
	onRegionClick?: (location: SvgGeoMapLocation, index: number) => void
	onRegionMouseEnter?: (location: SvgGeoMapLocation, index: number) => void
	onRegionMouseLeave?: (location: SvgGeoMapLocation, index: number) => void
	children?: React.ReactNode
	renderTooltip?: boolean | ((state: GeoRegionState) => React.ReactNode)
	defaultTooltipProps?: Pick<GeoMapTooltipProps, 'formatValue' | 'label'>
	tooltipPlacement?: FloatingPlacement
}
