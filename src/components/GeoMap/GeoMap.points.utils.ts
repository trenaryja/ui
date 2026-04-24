import { cn, cnFn, splitPlacement } from '@/utils'
import * as d3Geo from 'd3-geo'
import type { GeoPath, GeoPermissibleObjects, GeoProjection } from 'd3-geo'
import type { ClusterItem } from './GeoMap.cluster.utils'
import type {
	GeoAnchor,
	GeoClusterState,
	GeoMapBaseProps,
	GeoPoint,
	GeoPointState,
	GeoRegion,
	PointsConfig,
} from './GeoMap.types'

/**
 * Lucide MapPin, 24x24 viewBox, tip at ~(12, 22). Path is evergreen — if lucide
 * ever changes it, consumers override via `components.point`.
 */
export const DEFAULT_POINT_PATH =
	'M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6'

const DEFAULT_POINT_SIZE = 24

const POINT_CLASS = cn('fill-primary/70 stroke-primary-content/50 hover:fill-primary')
const CLUSTER_CIRCLE_CLASS = cn('fill-primary/70 stroke-primary-content/50 hover:fill-primary cursor-pointer')
const CLUSTER_TEXT_CLASS = cn('fill-primary-content font-semibold pointer-events-none select-none')

/** Default cluster size: logarithmic, capped. Configurable via `points.size`. */
const defaultClusterSize = (count: number) => Math.min(28 + Math.log2(count) * 6, 64)

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

export const POINT_ATTR = {
	id: 'data-point-id',
	idx: 'data-point-idx',
	cx: 'data-cx',
	cy: 'data-cy',
	scale: 'data-s',
	anchorX: 'data-ax',
	anchorY: 'data-ay',
} as const

export const CLUSTER_ATTR = {
	id: 'data-cluster-id',
	idx: 'data-cluster-idx',
	cx: 'data-cx',
	cy: 'data-cy',
} as const

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

const buildPointPath = ({
	id,
	idx,
	coords,
	size,
	anchor,
	cls,
	projection,
	pathGen,
}: {
	id: string
	idx: number
	coords: [number, number]
	size: number
	anchor: readonly [number, number]
	cls: string
	projection: GeoProjection
	pathGen: GeoPath<unknown, GeoPermissibleObjects>
}) => {
	const geom: GeoJSON.Point = { type: 'Point', coordinates: coords }
	if (pathGen(geom) == null) return ''
	const projected = projection(coords)
	if (!projected) return ''
	const [cx, cy] = projected
	const scale = size / DEFAULT_POINT_SIZE
	const t = buildPointTransform({ cx, cy, s: scale, anchor, k: 1 })
	return `<path ${POINT_ATTR.id}="${id}" ${POINT_ATTR.idx}="${idx}" ${POINT_ATTR.cx}="${cx}" ${POINT_ATTR.cy}="${cy}" ${POINT_ATTR.scale}="${scale}" ${POINT_ATTR.anchorX}="${anchor[0]}" ${POINT_ATTR.anchorY}="${anchor[1]}" d="${DEFAULT_POINT_PATH}" transform="${t}" class="${cls}" vector-effect="non-scaling-stroke"/>`
}

/** `translate(cx,cy) scale(1/k)` — counter-scale for constant pixel cluster size under zoom. */
const buildClusterTransform = ({ cx, cy, k }: { cx: number; cy: number; k: number }) =>
	`translate(${cx},${cy}) scale(${1 / k})`

const buildClusterMarkup = ({
	item,
	idx,
	size,
	cls,
	projection,
	pathGen,
}: {
	item: Extract<ClusterItem, { kind: 'cluster' }>
	idx: number
	size: number
	cls: string
	projection: GeoProjection
	pathGen: GeoPath<unknown, GeoPermissibleObjects>
}) => {
	const geom: GeoJSON.Point = { type: 'Point', coordinates: item.coords }
	if (pathGen(geom) == null) return ''
	const projected = projection(item.coords)
	if (!projected) return ''
	const [cx, cy] = projected
	const r = size / 2
	const t = buildClusterTransform({ cx, cy, k: 1 })
	// Stored for zoom-time patching via updatePointTransforms.
	const dataAttrs = `${CLUSTER_ATTR.id}="${item.id}" ${CLUSTER_ATTR.idx}="${idx}" ${CLUSTER_ATTR.cx}="${cx}" ${CLUSTER_ATTR.cy}="${cy}"`
	return `<g ${dataAttrs} transform="${t}"><circle r="${r}" class="${cls}" vector-effect="non-scaling-stroke"/><text text-anchor="middle" dominant-baseline="central" class="${CLUSTER_TEXT_CLASS}" style="font-size:${Math.max(10, r * 0.7)}px">${item.count}</text></g>`
}

type SizeProp = PointsConfig['size']

const resolvePointSize = (sizeProp: SizeProp, state: GeoPointState): number => {
	if (typeof sizeProp === 'function') return sizeProp(state)
	if (typeof sizeProp === 'number') return sizeProp
	return DEFAULT_POINT_SIZE
}

const resolveClusterSize = (sizeProp: SizeProp, state: GeoClusterState): number => {
	if (typeof sizeProp === 'function') return sizeProp(state)
	if (typeof sizeProp === 'number') return sizeProp
	return defaultClusterSize(state.count)
}

type MarkupCtx = {
	anchor: readonly [number, number]
	classNames: NonNullable<GeoMapBaseProps['classNames']>
	sizeProp: SizeProp
	selected: Set<string>
	projection: GeoProjection
	pathGen: GeoPath<unknown, GeoPermissibleObjects>
}

const buildPointMarkupFromState = ({
	state,
	id,
	coords,
	ctx,
}: {
	state: GeoPointState
	id: string
	coords: [number, number]
	ctx: MarkupCtx
}) => {
	const size = resolvePointSize(ctx.sizeProp, state)
	const customClass = ctx.classNames.point ? cnFn(ctx.classNames.point, state) : ''
	const cls = customClass ? `${POINT_CLASS} ${customClass}` : POINT_CLASS
	return buildPointPath({
		id,
		idx: state.index,
		coords,
		size,
		anchor: ctx.anchor,
		cls,
		projection: ctx.projection,
		pathGen: ctx.pathGen,
	})
}

const buildClusterMarkupFromItem = (item: Extract<ClusterItem, { kind: 'cluster' }>, idx: number, ctx: MarkupCtx) => {
	// `points` is a lazy getter — resolving a cluster's leaves is O(cluster size), and most renders
	// never need it. Tooltip/handler paths access it; functional `classNames.cluster` consumers
	// pay only if they read `state.points`.
	const state: GeoClusterState = {
		id: item.id,
		count: item.count,
		coordinates: item.coords,
		isHovered: false,
		get points() {
			return item.getPoints()
		},
	}
	const size = resolveClusterSize(ctx.sizeProp, state)
	const customClass = ctx.classNames.cluster ? cnFn(ctx.classNames.cluster, state) : ''
	const cls = customClass ? `${CLUSTER_CIRCLE_CLASS} ${customClass}` : CLUSTER_CIRCLE_CLASS
	return buildClusterMarkup({ item, idx, size, cls, projection: ctx.projection, pathGen: ctx.pathGen })
}

const pointStateFromItem = (
	item: Extract<ClusterItem, { kind: 'point' }>,
	point: GeoPoint,
	selected: Set<string>,
): GeoPointState => ({
	point,
	index: item.index,
	isSelected: selected.has(point.id),
	isHovered: false,
	value: point.properties.value,
})

const buildClusteredMarkup = (
	clusterItems: readonly ClusterItem[],
	points: readonly GeoPoint[],
	ctx: MarkupCtx,
): string => {
	const pointById = new Map(points.map((p) => [p.id, p]))
	const parts: string[] = []

	for (let i = 0; i < clusterItems.length; i++) {
		const item = clusterItems[i]

		if (item.kind === 'cluster') {
			parts.push(buildClusterMarkupFromItem(item, i, ctx))
			continue
		}

		const point = pointById.get(item.pointId) ?? pointById.get(item.pointId.split('-')[0])
		if (!point) continue
		const state = pointStateFromItem(item, point, ctx.selected)
		parts.push(buildPointMarkupFromState({ state, id: item.pointId, coords: item.coords, ctx }))
	}

	return parts.join('')
}

const buildUnclusteredMarkup = (points: readonly GeoPoint[], regionById: Map<string, GeoRegion>, ctx: MarkupCtx) => {
	const resolved = resolvePointCoords(points, regionById)
	const parts: string[] = []

	for (const r of resolved) {
		const state: GeoPointState = {
			point: r.point,
			index: r.index,
			isSelected: ctx.selected.has(r.point.id),
			isHovered: false,
			value: r.point.properties.value,
		}
		parts.push(buildPointMarkupFromState({ state, id: r.id, coords: r.coords, ctx }))
	}

	return parts.join('')
}

export const buildPointsMarkup = ({
	config,
	projection,
	pathGen,
	regions,
	classNames,
	selectedPointIds,
	clusterItems,
}: {
	config: PointsConfig | undefined
	projection: GeoProjection
	pathGen: GeoPath<unknown, GeoPermissibleObjects>
	regions: readonly GeoRegion[]
	classNames: NonNullable<GeoMapBaseProps['classNames']>
	selectedPointIds: readonly string[]
	clusterItems?: readonly ClusterItem[]
}) => {
	const points = config?.data
	if (!points?.length || !config) return ''
	const ctx: MarkupCtx = {
		anchor: resolveAnchor(config.anchor ?? 'bottom-center'),
		classNames,
		sizeProp: config.size,
		selected: new Set(selectedPointIds),
		projection,
		pathGen,
	}
	if (clusterItems) return buildClusteredMarkup(clusterItems, points, ctx)
	const regionById = new Map(regions.map((r) => [r.id, r]))
	return buildUnclusteredMarkup(points, regionById, ctx)
}

/** Rewrite every point's and cluster's `transform` for the given zoom scale. Cheap: reads cached data-* attrs. */
export const updatePointTransforms = (pointsGroup: SVGGElement | null, k: number) => {
	if (!pointsGroup) return

	const paths = pointsGroup.querySelectorAll<SVGPathElement>(`path[${POINT_ATTR.idx}]`)

	for (const path of paths) {
		const cx = Number(path.getAttribute(POINT_ATTR.cx))
		const cy = Number(path.getAttribute(POINT_ATTR.cy))
		const scale = Number(path.getAttribute(POINT_ATTR.scale))
		const anchorX = Number(path.getAttribute(POINT_ATTR.anchorX))
		const anchorY = Number(path.getAttribute(POINT_ATTR.anchorY))
		path.setAttribute('transform', buildPointTransform({ cx, cy, s: scale, anchor: [anchorX, anchorY], k }))
	}

	const clusters = pointsGroup.querySelectorAll<SVGGElement>(`g[${CLUSTER_ATTR.idx}]`)

	for (const g of clusters) {
		const cx = Number(g.getAttribute(CLUSTER_ATTR.cx))
		const cy = Number(g.getAttribute(CLUSTER_ATTR.cy))
		g.setAttribute('transform', buildClusterTransform({ cx, cy, k }))
	}
}
