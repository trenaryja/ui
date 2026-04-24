'use client'

import { useMemo } from 'react'
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
	selectedPointIds: readonly string[]
}

export const useGeoClusters = ({ points, regions, zoom, selectedPointIds }: Args): GeoClusters => {
	const raw = points?.cluster
	const radius = typeof raw === 'object' ? raw.radius : undefined
	const maxZoom = typeof raw === 'object' ? raw.maxZoom : undefined
	const minPoints = typeof raw === 'object' ? raw.minPoints : undefined
	const clusterConfig = useMemo(() => {
		if (!raw) return null
		if (raw === true) return {}
		return { radius, maxZoom, minPoints }
	}, [raw, radius, maxZoom, minPoints])

	const data = points?.data

	// Index in geographic space so cluster memberships are stable during pan/rotation.
	// Counts only change on zoom level change, which is the correct and expected behavior.
	const clusterIndex = useMemo(
		() => (clusterConfig && data?.length ? buildClusterIndex({ points: data, regions, config: clusterConfig }) : null),
		[clusterConfig, data, regions],
	)

	const zoomLevel = scaleToZoomLevel(zoom?.scale ?? 1)

	const items = useMemo(
		() =>
			clusterIndex && data
				? queryClusterItems({ index: clusterIndex, zoomLevel, points: data, selectedPointIds })
				: undefined,
		[clusterIndex, zoomLevel, data, selectedPointIds],
	)

	const zoomTargetFor = (state: GeoClusterState): GeoZoomState => {
		const expansionZoom = clusterIndex?.getClusterExpansionZoom(state.id) ?? zoomLevel + 2
		// Zoom one virtual tile level past expansion for a satisfying click animation.
		return { scale: Math.min(2 ** (expansionZoom + 1), GEOMAP_MAX_SCALE), center: state.coordinates }
	}

	return { items, zoomTargetFor }
}
