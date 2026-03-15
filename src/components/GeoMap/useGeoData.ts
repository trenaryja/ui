'use client'

import { use } from 'react'
import { isGeoMapPreset, resolveGeoData, resolveGeoPreset } from './GeoMap.geo'
import type { GeoDataSource, GeoFeature } from './GeoMap.types'

const fetchCache = new Map<string, Promise<GeoFeature[]>>()

const fetchGeoData = (url: string): Promise<GeoFeature[]> => {
	const cached = fetchCache.get(url)
	if (cached) return cached

	const promise = fetch(url)
		.then((res) => {
			if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
			return res.json()
		})
		.then((data) => resolveGeoData(data))

	fetchCache.set(url, promise)
	return promise
}

export const useGeoData = (geo: GeoDataSource | undefined) => {
	if (typeof geo === 'string' && isGeoMapPreset(geo)) {
		return { features: resolveGeoPreset(geo) }
	}

	if (typeof geo === 'string') {
		const features = use(fetchGeoData(geo))
		return { features }
	}

	return { features: resolveGeoData(geo) }
}
