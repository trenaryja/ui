'use client'

import { useMemo } from 'react'
import type { GeoProjection } from 'd3-geo'
import type { GeoClusterState, GeoRegion, GeoZoomState, PointsConfig } from '../GeoMap.types'
import type { ClusterItem } from '../GeoMap.cluster.utils'
import { buildClusterIndex, queryClusterItems, scaleToZoomLevel } from '../GeoMap.cluster.utils'
import { GEOMAP_MAX_SCALE } from './useGeoZoom'

export type GeoClusters = {
	items: readonly ClusterItem[] | undefined
	/** Returns the GeoZoomState that expands this cluster. Pass to `animateZoom` or `setZoom`. */
	zoomTargetFor: (state: GeoClusterState) => GeoZoomState
}

type Args = {
	points: PointsConfig | undefined
	regions: readonly GeoRegion[]
	zoom: GeoZoomState | undefined
	projection: GeoProjection
	viewBoxW: number
	viewBoxH: number
	selectedPointIds: readonly string[]
}

export const useGeoClusters = ({
	points,
	regions,
	zoom,
	projection,
	viewBoxW,
	viewBoxH,
	selectedPointIds,
}: Args): GeoClusters => {
	const raw = points?.cluster
	const radius = typeof raw === 'object' ? raw.radius : undefined
	const maxZoom = typeof raw === 'object' ? raw.maxZoom : undefined
	const minPoints = typeof raw === 'object' ? raw.minPoints : undefined
	const clusterConfig = useMemo(() => {
		if (!raw) return null
		if (raw === true) return {}
		return { radius, maxZoom, minPoints }
	}, [raw, radius, maxZoom, minPoints])

	// Project geographic coords to screen space, then normalize to [-180,180]×[-90,90].
	// Clustering in this virtual space makes the radius mean "screen pixels" for any projection —
	// geographic distance ≠ visual distance inside AlbersUSA's Alaska/Hawaii insets.
	const toVirtual = (geo: [number, number]): [number, number] | null => {
		const screen = projection(geo)
		if (!screen) return null
		return [(screen[0] / viewBoxW) * 360 - 180, 90 - (screen[1] / viewBoxH) * 180]
	}

	// Inverse: virtual coords → screen → geographic (for rendering cluster pins and zoom targets).
	const fromVirtual = (virtual: [number, number]): [number, number] | null => {
		const x = ((virtual[0] + 180) / 360) * viewBoxW
		const y = ((90 - virtual[1]) / 180) * viewBoxH
		return (projection.invert?.([x, y]) as [number, number] | null) ?? null
	}

	const clusterIndex = useMemo(
		() =>
			clusterConfig && points?.data.length
				? buildClusterIndex({ points: points.data, regions, config: clusterConfig, toVirtual })
				: null,
		// eslint-disable-next-line react-hooks/exhaustive-deps -- projection identity is stable across zoom (zoom is a SVG transform, not a projection mutation); rebuilds on resize or projection-type change via viewBoxW/H/projection deps
		[clusterConfig, points?.data, regions, projection, viewBoxW, viewBoxH],
	)

	const zoomLevel = scaleToZoomLevel(zoom?.scale ?? 1)

	const items = useMemo(() => {
		if (!clusterIndex || !points?.data) return undefined
		// Full virtual bbox — off-screen clusters are culled by the rendering layer.
		return queryClusterItems({ index: clusterIndex, zoomLevel, points: points.data, selectedPointIds, fromVirtual })
		// eslint-disable-next-line react-hooks/exhaustive-deps -- fromVirtual closes over projection/viewBox; clusterIndex already captures those deps and invalidates items when they change
	}, [clusterIndex, zoomLevel, points?.data, selectedPointIds])

	const zoomTargetFor = (state: GeoClusterState): GeoZoomState => {
		const expansionZoom = clusterIndex?.getClusterExpansionZoom(state.id) ?? zoomLevel + 2
		// Zoom one virtual tile level past expansion for a satisfying click animation.
		return { scale: Math.min(2 ** (expansionZoom + 1), GEOMAP_MAX_SCALE), center: state.coordinates }
	}

	return { items, zoomTargetFor }
}
