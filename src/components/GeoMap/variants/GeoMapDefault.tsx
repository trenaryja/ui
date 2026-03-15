'use client'

import { cn, cnFn, EMPTY_ARR, EMPTY_OBJ } from '@/utils'
import { FloatingPortal } from '@floating-ui/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
	buildPathGenerator,
	defaultProjectionForPreset,
	filterFeatures,
	isGeoMapPreset,
	resolveProjection,
} from '../GeoMap.geo'
import type { GeoFeature, GeoMapBaseProps, GeoMapTooltipComponents, GeoRegionState } from '../GeoMap.types'
import { buildLegendItems, getChoroFillFn } from '../GeoMap.utils'
import { GeoMapLegend } from '../GeoMapLegend'
import { GeoMapTooltip } from '../GeoMapTooltip'
import { SvgPatternDefs } from '../SvgPatternDefs'
import { useGeoData } from '../useGeoData'
import { createTooltipStore, useFloatingTooltip, useTooltipData } from '../useGeoMap'
import type { TooltipStore } from '../useGeoMap'

const VIEWBOX_W = 960
const VIEWBOX_H = 500
const VIEWBOX = `0 0 ${VIEWBOX_W} ${VIEWBOX_H}`

const slotComponents = <T,>(slot: boolean | T | undefined): T | undefined =>
	typeof slot === 'boolean' || slot == null ? undefined : slot

export type GeoMapDefaultProps = GeoMapBaseProps & {
	variant?: 'default'
	selectedIds?: readonly string[]
}

const UNSELECTED_CLASS = cn(
	'stroke-base-content/20',
	'hover:stroke-base-content hover:z-10',
	'fill-base-100',
	'hover:fill-base-300',
)

const SELECTED_CLASS = cn('stroke-base-content/20', 'hover:stroke-base-content hover:z-10', 'fill-base-content')

// ---------------------------------------------------------------------------
// Projection + features
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Build SVG paths as raw HTML string — bypasses React reconciliation entirely
// ---------------------------------------------------------------------------

const usePathMarkup = (
	props: Pick<GeoMapBaseProps, 'geo' | 'projection' | 'region'> & {
		choropleth?: GeoMapBaseProps['choropleth']
		classNames: NonNullable<GeoMapBaseProps['classNames']>
	},
) => {
	const { features, pathGen } = useGeoProjection(props)
	const choroFillFn = props.choropleth ? getChoroFillFn(props.choropleth) : undefined
	const hasCustomRegionClass = !!props.classNames.region

	const markup = useMemo(() => {
		const parts: string[] = []

		for (let i = 0; i < features.length; i++) {
			const feature = features[i]
			const d = pathGen(feature.geometry)
			if (!d) continue
			const choroFill = choroFillFn?.(feature.id)
			const customClass = hasCustomRegionClass
				? cnFn(props.classNames.region, {
						feature,
						index: i,
						isSelected: false,
						isHovered: false,
						value: props.choropleth?.data.find((dd) => dd.id === feature.id)?.value,
					})
				: ''
			const cls = customClass ? `${UNSELECTED_CLASS} ${customClass}` : UNSELECTED_CLASS
			const style = choroFill ? ` style="fill:${choroFill}"` : ''
			parts.push(`<path data-idx="${i}" d="${d}" class="${cls}"${style}/>`)
		}

		return parts.join('')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [features, pathGen])

	return { features, markup }
}

const getFeatureIndex = (e: React.MouseEvent): number | null => {
	const target = (e.target as SVGElement).closest('path[data-idx]')
	if (!target) return null
	return Number(target.getAttribute('data-idx'))
}

// ---------------------------------------------------------------------------
// Tooltip subscriber
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Selection via direct DOM
// ---------------------------------------------------------------------------

const useSelectionEffect = (opts: {
	gRef: React.RefObject<SVGGElement | null>
	features: readonly GeoFeature[]
	selectedIds: readonly string[]
	getChoroFill?: (id: string) => string | undefined
}) => {
	const { gRef, features, selectedIds, getChoroFill } = opts
	const hasSelection = selectedIds.length > 0
	useEffect(() => {
		const g = gRef.current
		if (!g) return
		const selectedSet = new Set(selectedIds)

		for (const path of g.querySelectorAll('path[data-idx]')) {
			const feature = features[Number(path.getAttribute('data-idx'))]
			if (!feature) continue
			if (selectedSet.has(feature.id)) {
				path.setAttribute('class', SELECTED_CLASS)
				;(path as SVGPathElement).style.fill = ''
			} else {
				path.setAttribute('class', UNSELECTED_CLASS)
				const choroFill = hasSelection ? undefined : getChoroFill?.(feature.id)
				;(path as SVGPathElement).style.fill = choroFill ?? ''
			}
		}
	}, [gRef, selectedIds, features, hasSelection, getChoroFill])
	return hasSelection
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

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
	const { features, markup } = usePathMarkup({ geo, projection: projectionProp, region, choropleth, classNames })
	const hasTooltip = components.tooltip !== false
	const [tooltipStore] = useState(createTooltipStore)
	const getChoroFill = choropleth ? getChoroFillFn(choropleth) : undefined
	const gRef = useRef<SVGGElement>(null)
	const hasSelection = useSelectionEffect({ gRef, features, selectedIds, getChoroFill })

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
			const feature = features[idx]
			const value = choropleth?.data.find((d) => d.id === feature.id)?.value
			tooltipStore.show(idx, feature, value)
			onRegionMouseEnter?.(feature, idx)
		},
		[features, choropleth, tooltipStore, onRegionMouseEnter],
	)

	const handleMouseMove = useCallback(
		(e: React.MouseEvent) => tooltipStore.setPoint(e.clientX, e.clientY),
		[tooltipStore],
	)

	const handleMouseOut = useCallback(
		(e: React.MouseEvent) => {
			const idx = getFeatureIndex(e)
			if (idx == null) return
			tooltipStore.hide()
			onRegionMouseLeave?.(features[idx], idx)
		},
		[features, tooltipStore, onRegionMouseLeave],
	)

	const showLegend = !!(components.legend && choropleth?.data.length && !hasSelection)
	const legendItems = showLegend ? buildLegendItems(choropleth) : []

	return (
		<>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				viewBox={VIEWBOX}
				className={cn('w-full h-auto', className)}
				{...svgProps}
			>
				<g
					ref={gRef}
					onClick={handleClick}
					onMouseOver={handleMouseOver}
					onMouseMove={handleMouseMove}
					onMouseOut={handleMouseOut}
					dangerouslySetInnerHTML={{ __html: markup }}
				/>
				<SvgPatternDefs />
				{children}
			</svg>
			{hasTooltip && (
				<GeoMapFloatingTooltip
					store={tooltipStore}
					selectedIds={selectedIds}
					getChoroFill={getChoroFill}
					classNames={classNames}
					formatters={formatters}
					components={slotComponents(components.tooltip)}
				/>
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
