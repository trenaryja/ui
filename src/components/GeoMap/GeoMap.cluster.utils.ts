import Supercluster from 'supercluster'
import type { ClusterConfig, ClusteredPoint, GeoPoint, GeoRegion } from './GeoMap.types'
import { resolvePointCoord } from './GeoMap.points.utils'

const DEFAULT_CLUSTER_RADIUS = 40
const DEFAULT_CLUSTER_MIN_POINTS = 2
const DEFAULT_CLUSTER_MAX_ZOOM = 8

type PointProps = { pointId: string; index: number }

export type ClusterIndex = Supercluster<PointProps>

/**
 * Build a Supercluster index from the given points. Expensive — memoize on `data`.
 *
 * When `toVirtual` is provided, geographic coordinates are projected to screen space and
 * normalized to WGS84 range before indexing. This makes the clustering radius mean "screen
 * pixels" for any projection — critical for composite projections like AlbersUSA where
 * geographic distance doesn't match visual distance inside the Alaska/Hawaii insets.
 */
export const buildClusterIndex = ({
	points,
	regions,
	config,
	toVirtual,
}: {
	points: readonly GeoPoint[]
	regions: readonly GeoRegion[]
	config: ClusterConfig
	toVirtual?: (geo: [number, number]) => [number, number] | null
}): ClusterIndex => {
	const features: GeoJSON.Feature<GeoJSON.Point, PointProps>[] = []

	const addPoint = (geoCoord: [number, number], pointId: string, index: number) => {
		const indexCoord = toVirtual ? toVirtual(geoCoord) : geoCoord
		if (!indexCoord) return
		features.push({
			type: 'Feature',
			geometry: { type: 'Point', coordinates: indexCoord },
			properties: { pointId, index },
		})
	}

	for (let i = 0; i < points.length; i++) {
		const p = points[i]
		const coord = resolvePointCoord(p, regions)
		if (!coord) continue

		if (p.geometry?.type === 'MultiPoint') {
			p.geometry.coordinates.forEach((c, j) => addPoint(c as [number, number], `${p.id}-${j}`, i))
		} else {
			addPoint(coord, p.id, i)
		}
	}

	const index = new Supercluster<PointProps>({
		radius: config.radius ?? DEFAULT_CLUSTER_RADIUS,
		minPoints: config.minPoints ?? DEFAULT_CLUSTER_MIN_POINTS,
		maxZoom: config.maxZoom ?? DEFAULT_CLUSTER_MAX_ZOOM,
	})
	index.load(features)

	return index
}

type ClusterProperties = { cluster: true; cluster_id: number; point_count: number }

/** Discriminated result — either a cluster (with id, count, points) or a single point (with pointId, index). */
export type ClusterItem =
	| {
			kind: 'cluster'
			id: number
			count: number
			coords: [number, number]
			getPoints: () => readonly ClusteredPoint[]
			getExpansionZoom: () => number
	  }
	| {
			kind: 'point'
			pointId: string
			index: number
			coords: [number, number]
	  }

/**
 * d3-zoom scale → supercluster zoom level (virtual screen-space clustering).
 * Discrete integer so markup memo key stabilizes between micro-scale changes while panning.
 */
export const scaleToZoomLevel = (scale: number): number => Math.max(0, Math.floor(Math.log2(scale)))

/** Query the index at the given zoom level and return a flat cluster-or-point list. */
export const queryClusterItems = ({
	index,
	zoomLevel,
	points,
	selectedPointIds,
	bbox = [-180, -90, 180, 90],
	fromVirtual,
}: {
	index: ClusterIndex
	zoomLevel: number
	points: readonly GeoPoint[]
	selectedPointIds: readonly string[]
	bbox?: [number, number, number, number]
	fromVirtual?: (virtual: [number, number]) => [number, number] | null
}): ClusterItem[] => {
	const selected = new Set(selectedPointIds)
	const pointById = new Map(points.map((p) => [p.id, p]))

	const raw = index.getClusters(bbox, zoomLevel) as (
		| GeoJSON.Feature<GeoJSON.Point, ClusterProperties>
		| GeoJSON.Feature<GeoJSON.Point, PointProps>
	)[]

	const resolveCoords = (coords: [number, number]): [number, number] =>
		(fromVirtual ? fromVirtual(coords) : null) ?? coords

	return raw.map((f): ClusterItem => {
		const coords = resolveCoords(f.geometry.coordinates as [number, number])
		const props = f.properties

		if ('cluster' in props && props.cluster) {
			return {
				kind: 'cluster',
				id: props.cluster_id,
				count: props.point_count,
				coords,
				getPoints: () => {
					const leaves = index.getLeaves(props.cluster_id, Infinity) as GeoJSON.Feature<GeoJSON.Point, PointProps>[]
					const out: ClusteredPoint[] = []

					for (const leaf of leaves) {
						const base = pointById.get(leaf.properties.pointId)
						if (base) out.push({ ...base, isSelected: selected.has(base.id) })
					}

					return out
				},
				getExpansionZoom: () => index.getClusterExpansionZoom(props.cluster_id),
			}
		}

		return { kind: 'point', pointId: (props as PointProps).pointId, index: (props as PointProps).index, coords }
	})
}
