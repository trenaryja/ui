'use client'

import type { GeoPath, GeoPermissibleObjects, GeoProjection } from 'd3-geo'
import { createContext, use } from 'react'
import type { ChoroplethScaleType, GeoFeature, GeoZoomState } from './GeoMap.types'

export type GeoMapContextValue = {
	projection: GeoProjection
	pathGenerator: GeoPath<unknown, GeoPermissibleObjects>
	features: readonly GeoFeature[]
	width: number
	height: number
	zoom: GeoZoomState | undefined
	selectedIds: readonly string[]
	choropleth: {
		colorFn: (featureId: string) => string | undefined
		scaleType: ChoroplethScaleType
	} | null
}

export const GeoMapContext = createContext<GeoMapContextValue | null>(null)

export const useGeoMap = () => {
	const ctx = use(GeoMapContext)
	if (!ctx) throw new Error('useGeoMap must be used within a <GeoMap> component')
	return ctx
}
