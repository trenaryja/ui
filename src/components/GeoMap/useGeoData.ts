'use client'

import { use } from 'react'
import type { GeoMapPreset } from './GeoMap.geo'
import { isGeoMapPreset, resolveGeoData, resolveGeoPreset } from './GeoMap.geo'
import type { GeoDataSource, GeoFeature } from './GeoMap.types'

const fetchCache = new Map<string, Promise<GeoFeature[]>>()
const presetCache = new Map<GeoMapPreset, GeoFeature[]>()

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

const getCachedPreset = (preset: GeoMapPreset): GeoFeature[] => {
	const cached = presetCache.get(preset)
	if (cached) return cached
	const features = resolveGeoPreset(preset)
	presetCache.set(preset, features)
	return features
}

export const useGeoData = (geo: GeoDataSource | undefined) => {
	if (typeof geo === 'string' && isGeoMapPreset(geo)) {
		return { features: getCachedPreset(geo) }
	}

	if (typeof geo === 'string') {
		const features = use(fetchGeoData(geo))
		return { features }
	}

	return { features: resolveGeoData(geo) }
}
