'use client'

import { useMemo } from 'react'
import type { GeoProjection } from 'd3-geo'
import type { GeoClusterState, GeoRegion, GeoZoomState, PointsConfig } from '../GeoMap.types'
import type { ClusterItem } from '../GeoMap.cluster.utils'
import { buildClusterIndex, queryClusterItems, scaleToZoomLevel } from '../GeoMap.cluster.utils'
import { computeViewportBbox } from '../GeoMap.utils'
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

	const clusterIndex = useMemo(
		() => (clusterConfig && points?.data.length ? buildClusterIndex(points.data, regions, clusterConfig) : null),
		[clusterConfig, points?.data, regions],
	)

	const zoomLevel = scaleToZoomLevel(zoom?.scale ?? 1)
	const bbox = computeViewportBbox({ projection, zoom, viewBoxW, viewBoxH })

	const items = useMemo(() => {
		if (!clusterIndex || !points?.data) return undefined
		return queryClusterItems({ index: clusterIndex, zoomLevel, points: points.data, selectedPointIds, bbox })
		// eslint-disable-next-line react-hooks/exhaustive-deps -- bbox tuple compared by value via .join for stable memo across re-renders
	}, [clusterIndex, zoomLevel, points?.data, selectedPointIds, bbox.join(',')])

	const zoomTargetFor = (state: GeoClusterState): GeoZoomState => {
		const expansionZoom = clusterIndex?.getClusterExpansionZoom(state.id) ?? zoomLevel + 2
		return { scale: Math.min(2 ** expansionZoom, GEOMAP_MAX_SCALE), center: state.coordinates }
	}

	return { items, zoomTargetFor }
}
