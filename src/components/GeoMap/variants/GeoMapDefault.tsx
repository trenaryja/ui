'use client'

import { cn, cnFn, EMPTY_ARR, EMPTY_OBJ } from '@/utils'
import { FloatingPortal } from '@floating-ui/react'
import { memo, useCallback } from 'react'
import type { GeoPath, GeoPermissibleObjects } from 'd3-geo'
import {
	buildPathGenerator,
	defaultProjectionForPreset,
	filterFeatures,
	isGeoMapPreset,
	resolveProjection,
} from '../GeoMap.geo'
import type { GeoFeature, GeoMapBaseProps, GeoMapTooltipComponents, GeoRegionState } from '../GeoMap.types'
import { buildLegendItems } from '../GeoMap.utils'
import { GeoMapLegend } from '../GeoMapLegend'
import { GeoMapTooltip } from '../GeoMapTooltip'
import { SvgPatternDefs } from '../SvgPatternDefs'
import { useGeoData } from '../useGeoData'
import { useGeoMap } from '../useGeoMap'

const VIEWBOX_W = 960
const VIEWBOX_H = 500
const VIEWBOX = `0 0 ${VIEWBOX_W} ${VIEWBOX_H}`

const slotComponents = <T,>(slot: boolean | T | undefined): T | undefined =>
	typeof slot === 'boolean' || slot == null ? undefined : slot

const TooltipContent = ({
	components: tooltipComponents,
	...props
}: {
	state: React.ComponentProps<typeof GeoMapTooltip>['state']
	color?: string
	classNames?: React.ComponentProps<typeof GeoMapTooltip>['classNames']
	formatters?: React.ComponentProps<typeof GeoMapTooltip>['formatters']
	components?: GeoMapTooltipComponents
}) => {
	if (typeof tooltipComponents === 'function') {
		const Replacement = tooltipComponents
		return <Replacement state={props.state} color={props.color} />
	}

	return <GeoMapTooltip {...props} components={tooltipComponents} />
}

export type GeoMapDefaultProps = GeoMapBaseProps & {
	variant?: 'default'
	selectedIds?: readonly string[]
}

const regionClassName = (state: GeoRegionState, classNames: NonNullable<GeoMapBaseProps['classNames']>) =>
	cn(
		'stroke-base-content/20',
		'hover:stroke-base-content hover:z-10',
		'fill-base-100',
		!state.isSelected && 'hover:fill-base-300',
		state.isSelected && 'fill-base-content',
		cnFn(classNames.region, state),
	)

const useGeoProjection = (props: Pick<GeoMapBaseProps, 'geo' | 'projection' | 'region'>) => {
	const { features: allFeatures } = useGeoData(props.geo)
	const features = props.region ? filterFeatures(allFeatures, props.region) : allFeatures

	const effectiveProjection =
		props.projection ??
		(typeof props.geo === 'string' && isGeoMapPreset(props.geo) ? defaultProjectionForPreset(props.geo) : undefined)
	const projection = resolveProjection(effectiveProjection, VIEWBOX_W, VIEWBOX_H)

	if (features.length > 0) {
		const fc: GeoJSON.FeatureCollection = {
			type: 'FeatureCollection',
			features: features.map((f) => ({ type: 'Feature' as const, geometry: f.geometry, properties: {} })),
		}
		projection.fitSize([VIEWBOX_W, VIEWBOX_H], fc)
	}

	return { features, pathGen: buildPathGenerator(projection) }
}

/** Extract feature index from a delegated event target's data-idx attribute */
const getFeatureIndex = (e: React.MouseEvent): number | null => {
	const target = (e.target as SVGElement).closest('path[data-idx]')
	if (!target) return null
	return Number(target.getAttribute('data-idx'))
}

/**
 * Memoized path list — only re-renders when features, selectedIds, choropleth, or classNames change.
 * Hover state does NOT cause this to re-render (hover is pure CSS).
 */
const GeoPathList = memo(
	({
		features,
		pathGen,
		getRegionState,
		getChoroFill,
		hasSelection,
		classNames,
	}: {
		features: readonly GeoFeature[]
		pathGen: GeoPath<unknown, GeoPermissibleObjects>
		getRegionState: (feature: GeoFeature, index: number) => GeoRegionState
		getChoroFill: (id: string) => string | undefined
		hasSelection: boolean
		classNames: NonNullable<GeoMapBaseProps['classNames']>
	}) =>
		features.map((feature, index) => {
			const d = pathGen(feature.geometry)
			if (!d) return null
			const state = getRegionState(feature, index)
			const choroFill = getChoroFill(feature.id)
			return (
				<path
					key={feature.id}
					data-idx={index}
					d={d}
					className={regionClassName(state, classNames)}
					style={choroFill && !hasSelection ? { fill: choroFill } : undefined}
				/>
			)
		}),
)

export const GeoMapDefault = ({
	geo,
	projection: projectionProp,
	region,
	className,
	classNames = EMPTY_OBJ,
	choropleth,
	selectedIds = EMPTY_ARR,
	components = EMPTY_OBJ,
	formatters = EMPTY_OBJ,
	legendTarget,
	onRegionClick,
	onRegionMouseEnter,
	onRegionMouseLeave,
	children,
	...svgProps
}: GeoMapDefaultProps) => {
	const { features, pathGen } = useGeoProjection({ geo, projection: projectionProp, region })
	const hasTooltip = components.tooltip !== false
	const {
		getRegionState,
		getChoroFill,
		tooltipData,
		showTooltip,
		hideTooltip,
		floatingRef,
		floatingStyles,
		onRegionMouseMove,
	} = useGeoMap({ selectedIds, choropleth, hasTooltip })

	const hasSelection = selectedIds.length > 0
	const showLegend = !!(components.legend && choropleth?.data.length && !hasSelection)
	const legendItems = showLegend ? buildLegendItems(choropleth) : []

	const handleClick = useCallback(
		(e: React.MouseEvent) => {
			const idx = getFeatureIndex(e)
			if (idx != null) onRegionClick?.(features[idx], idx)
		},
		[features, onRegionClick],
	)

	const handleMouseOver = useCallback(
		(e: React.MouseEvent) => {
			const idx = getFeatureIndex(e)
			if (idx == null) return
			showTooltip(features[idx], idx)
			onRegionMouseEnter?.(features[idx], idx)
		},
		[features, showTooltip, onRegionMouseEnter],
	)

	const handleMouseOut = useCallback(
		(e: React.MouseEvent) => {
			const idx = getFeatureIndex(e)
			if (idx == null) return
			hideTooltip()
			onRegionMouseLeave?.(features[idx], idx)
		},
		[features, hideTooltip, onRegionMouseLeave],
	)

	const hoveredRegionState = tooltipData ? getRegionState(tooltipData.feature, tooltipData.index) : null

	return (
		<>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				viewBox={VIEWBOX}
				className={cn('w-full h-auto', className)}
				{...svgProps}
			>
				<g
					onClick={handleClick}
					onMouseOver={handleMouseOver}
					onMouseMove={onRegionMouseMove}
					onMouseOut={handleMouseOut}
				>
					<GeoPathList
						features={features}
						pathGen={pathGen}
						getRegionState={getRegionState}
						getChoroFill={getChoroFill}
						hasSelection={hasSelection}
						classNames={classNames}
					/>
				</g>
				<SvgPatternDefs />
				{children}
			</svg>
			{hasTooltip && hoveredRegionState && (
				<FloatingPortal>
					<div ref={floatingRef} style={{ ...floatingStyles, pointerEvents: 'none' }}>
						<TooltipContent
							state={hoveredRegionState}
							color={getChoroFill(hoveredRegionState.feature.id)}
							classNames={classNames.tooltip}
							formatters={formatters.tooltip}
							components={slotComponents(components.tooltip)}
						/>
					</div>
				</FloatingPortal>
			)}
			{showLegend && (
				<GeoMapLegend
					items={legendItems}
					choropleth={choropleth}
					classNames={classNames.legend}
					formatters={formatters.legend}
					components={slotComponents(components.legend)}
					target={legendTarget}
				/>
			)}
		</>
	)
}
