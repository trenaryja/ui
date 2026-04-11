'use client'

import { use } from 'react'
import type { GeoMapPreset } from './GeoMap.geo'
import { isGeoMapPreset, loadPresetFeatures, resolveGeoData } from './GeoMap.geo'
import type { GeoDataSource, GeoFeature } from './GeoMap.types'

const urlCache = new Map<string, Promise<GeoFeature[]>>()
const presetCache = new Map<GeoMapPreset, Promise<GeoFeature[]>>()

const getUrlPromise = (url: string): Promise<GeoFeature[]> => {
	const cached = urlCache.get(url)
	if (cached) return cached
	const promise = fetch(url)
		.then((res) => {
			if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
			return res.json()
		})
		.then((data) => resolveGeoData(data))
	urlCache.set(url, promise)
	return promise
}

const getPresetPromise = (preset: GeoMapPreset): Promise<GeoFeature[]> => {
	const cached = presetCache.get(preset)
	if (cached) return cached
	const promise = loadPresetFeatures(preset)
	presetCache.set(preset, promise)
	return promise
}

export const useGeoData = (geo: GeoDataSource | undefined) => {
	if (geo === undefined || (typeof geo === 'string' && isGeoMapPreset(geo))) {
		const features = use(getPresetPromise(geo ?? 'world'))
		return { features }
	}

	if (typeof geo === 'string') {
		const features = use(getUrlPromise(geo))
		return { features }
	}

	return { features: resolveGeoData(geo) }
}
