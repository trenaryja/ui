import { cn, cnFn, splitPlacement } from '@/utils'
import * as d3Geo from 'd3-geo'
import type { GeoPath, GeoPermissibleObjects, GeoProjection } from 'd3-geo'
import type { GeoAnchor, GeoMapBaseProps, GeoPoint, GeoPointState, GeoRegion, PointsConfig } from './GeoMap.types'

/**
 * Lucide MapPin, 24x24 viewBox, tip at ~(12, 22). Path is evergreen — if lucide
 * ever changes it, consumers override via `components.point`.
 */
export const DEFAULT_POINT_PATH =
	'M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6'

const DEFAULT_POINT_SIZE = 24

const POINT_CLASS = cn('fill-primary/70 stroke-primary-content/50 hover:fill-primary')

/** Split transform — outer `scale(k)` + inner `scale(1/k)` keeps pixel size constant when called with k > 1. */
const buildPointTransform = ({
	cx,
	cy,
	s,
	anchor,
	k,
}: {
	cx: number
	cy: number
	s: number
	anchor: readonly [number, number]
	k: number
}) =>
	`translate(${cx},${cy}) scale(${s / k}) translate(${-anchor[0] * DEFAULT_POINT_SIZE},${-anchor[1] * DEFAULT_POINT_SIZE})`

const FLEX_TO_FRACTION = { start: 0, center: 0.5, end: 1 } as const

const resolveAnchor = (anchor: GeoAnchor): readonly [number, number] => {
	if (anchor === 'center') return [0.5, 0.5]
	if (Array.isArray(anchor)) return [anchor[0], anchor[1]]
	const [direction, flex] = splitPlacement(anchor as Exclude<GeoAnchor, 'center' | readonly [number, number]>)
	const f = FLEX_TO_FRACTION[flex]
	if (direction === 'top') return [f, 0]
	if (direction === 'bottom') return [f, 1]
	if (direction === 'left') return [0, f]
	return [1, f]
}

type ResolvedPoint = {
	point: GeoPoint
	/** Index into the original `points.data` array (stable across MultiPoint flattening). */
	index: number
	/** `${point.id}` or `${point.id}-${i}` for MultiPoint children. */
	id: string
	coords: [number, number]
}

/**
 * Single representative `[lon, lat]` for a point — Point coords, MultiPoint centroid, or the
 * snapped region centroid via `properties.regionId`. Returns `null` if nothing resolves.
 */
export const resolvePointCoord = (point: GeoPoint, regions: readonly GeoRegion[] = []): [number, number] | null => {
	if (point.geometry?.type === 'Point') return point.geometry.coordinates as [number, number]
	if (point.geometry?.type === 'MultiPoint' && point.geometry.coordinates.length > 0) {
		const sum = point.geometry.coordinates.reduce((acc, c) => [acc[0] + c[0], acc[1] + c[1]], [0, 0])
		const n = point.geometry.coordinates.length
		return [sum[0] / n, sum[1] / n]
	}
	if (!point.geometry && point.properties.regionId) {
		const region = regions.find((r) => r.id === point.properties.regionId)
		if (region) return d3Geo.geoCentroid(region)
	}

	return null
}

const resolvePointCoords = (points: readonly GeoPoint[], regionById: Map<string, GeoRegion>): ResolvedPoint[] => {
	const out: ResolvedPoint[] = []

	for (let i = 0; i < points.length; i++) {
		const p = points[i]

		if (p.geometry?.type === 'Point') {
			out.push({ point: p, index: i, id: p.id, coords: p.geometry.coordinates as [number, number] })
			continue
		}
		if (p.geometry?.type === 'MultiPoint') {
			p.geometry.coordinates.forEach((c, j) =>
				out.push({ point: p, index: i, id: `${p.id}-${j}`, coords: c as [number, number] }),
			)
			continue
		}
		if (!p.geometry && p.properties.regionId) {
			const region = regionById.get(p.properties.regionId)

			if (region) {
				const [lon, lat] = d3Geo.geoCentroid(region)
				out.push({ point: p, index: i, id: p.id, coords: [lon, lat] })
				continue
			}
		}
		if (import.meta.env?.DEV) console.warn(`[GeoMap] skipping point ${p.id}: no geometry and no resolvable regionId`)
	}

	return out
}

export const buildPointsMarkup = ({
	config,
	projection,
	pathGen,
	regions,
	classNames,
	selectedPointIds,
}: {
	config: PointsConfig | undefined
	projection: GeoProjection
	pathGen: GeoPath<unknown, GeoPermissibleObjects>
	regions: readonly GeoRegion[]
	classNames: NonNullable<GeoMapBaseProps['classNames']>
	selectedPointIds: readonly string[]
}) => {
	const points = config?.data
	if (!points?.length || !config) return ''
	const selected = new Set(selectedPointIds)
	const regionById = new Map(regions.map((r) => [r.id, r]))
	const resolved = resolvePointCoords(points, regionById)
	const anchor = resolveAnchor(config.anchor ?? 'bottom-center')
	const sizeProp = config.size
	const sizeFn =
		typeof sizeProp === 'function' ? sizeProp : () => (typeof sizeProp === 'number' ? sizeProp : DEFAULT_POINT_SIZE)

	const parts: string[] = []

	for (const r of resolved) {
		const geom: GeoJSON.Point = { type: 'Point', coordinates: r.coords }
		// pathGen applies the projection's clipping (orthographic's hemisphere, gnomonic's circle, etc).
		// projection() called directly skips clipping, so hidden points would still render.
		if (pathGen(geom) == null) continue
		const projected = projection(r.coords)
		if (!projected) continue
		const state: GeoPointState = {
			point: r.point,
			index: r.index,
			isSelected: selected.has(r.point.id),
			isHovered: false,
			value: r.point.properties.value,
		}
		const size = sizeFn(state)
		const [cx, cy] = projected
		const s = size / DEFAULT_POINT_SIZE
		const t = buildPointTransform({ cx, cy, s, anchor, k: 1 })
		const customClass = classNames.point ? cnFn(classNames.point, state) : ''
		const cls = customClass ? `${POINT_CLASS} ${customClass}` : POINT_CLASS
		parts.push(
			`<path data-point-id="${r.id}" data-point-idx="${r.index}" data-cx="${cx}" data-cy="${cy}" data-s="${s}" data-ax="${anchor[0]}" data-ay="${anchor[1]}" d="${DEFAULT_POINT_PATH}" transform="${t}" class="${cls}" vector-effect="non-scaling-stroke"/>`,
		)
	}

	return parts.join('')
}

/** Rewrite every point's `transform` attribute for the given zoom scale. Cheap: reads cached data-* attrs. */
export const updatePointTransforms = (pointsGroup: SVGGElement | null, k: number) => {
	if (!pointsGroup) return
	const paths = pointsGroup.querySelectorAll<SVGPathElement>('path[data-point-idx]')

	for (const path of paths) {
		const cx = Number(path.getAttribute('data-cx'))
		const cy = Number(path.getAttribute('data-cy'))
		const s = Number(path.getAttribute('data-s'))
		const ax = Number(path.getAttribute('data-ax'))
		const ay = Number(path.getAttribute('data-ay'))
		path.setAttribute('transform', buildPointTransform({ cx, cy, s, anchor: [ax, ay], k }))
	}
}
