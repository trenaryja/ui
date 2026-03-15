import { usCountiesTopo, usStatesTopo, worldTopo } from '@/data/geo'
import type { GeoPermissibleObjects, GeoProjection } from 'd3-geo'
import {
	geoAlbersUsa,
	geoEqualEarth,
	geoEquirectangular,
	geoMercator,
	geoNaturalEarth1,
	geoOrthographic,
	geoPath,
} from 'd3-geo'
import { geoPatterson } from 'd3-geo-projection'
import * as topojson from 'topojson-client'
import type { GeometryCollection, Topology } from 'topojson-specification'
import type { GeoDataSource, GeoFeature, GeoProjectionPreset, GeoRegionFilter } from './GeoMap.types'

// ---------------------------------------------------------------------------
// Projection factories
// ---------------------------------------------------------------------------

const projectionFactories: Record<GeoProjectionPreset, () => GeoProjection> = {
	'albers-usa': geoAlbersUsa,
	'equal-earth': geoEqualEarth as () => GeoProjection,
	equirectangular: geoEquirectangular,
	mercator: geoMercator,
	'natural-earth': geoNaturalEarth1,
	orthographic: geoOrthographic,
	patterson: geoPatterson as () => GeoProjection,
}

export const resolveProjection = (
	preset: ((width: number, height: number) => GeoProjection) | GeoProjectionPreset | undefined,
	width: number,
	height: number,
): GeoProjection => {
	if (typeof preset === 'function') return preset(width, height)
	const factory = projectionFactories[preset ?? 'patterson']
	return factory()
		.fitSize([width, height], { type: 'Sphere' } as GeoPermissibleObjects)
		.precision(0.1)
}

// ---------------------------------------------------------------------------
// TopoJSON → GeoFeature[]
// ---------------------------------------------------------------------------

const topoToFeatures = (topology: Topology, objectName?: string): GeoFeature[] => {
	const name = objectName ?? Object.keys(topology.objects)[0]
	const obj = topology.objects[name] as GeometryCollection
	const fc = topojson.feature(topology, obj)
	return fc.features.map((f, i) => {
		const props = (f.properties ?? {}) as Record<string, unknown>
		const rawId = f.id ?? props.id
		return {
			id: rawId != null ? String(rawId) : `_${name}_${i}`,
			name: String(props.NAME ?? props.name ?? ''),
			geometry: f.geometry,
			properties: props,
		}
	})
}

// ---------------------------------------------------------------------------
// Built-in map presets
// ---------------------------------------------------------------------------

export type GeoMapPreset = 'us-counties' | 'us-states' | 'world'

const builtInMaps: Record<GeoMapPreset, () => GeoFeature[]> = {
	world: () => topoToFeatures(worldTopo as unknown as Topology, 'countries'),
	'us-states': () => topoToFeatures(usStatesTopo as unknown as Topology, 'states'),
	'us-counties': () => topoToFeatures(usCountiesTopo as unknown as Topology, 'counties'),
}

export const isGeoMapPreset = (v: unknown): v is GeoMapPreset => typeof v === 'string' && v in builtInMaps

// ---------------------------------------------------------------------------
// Resolve geo data source → GeoFeature[]
// ---------------------------------------------------------------------------

export const resolveGeoData = (geo: Exclude<GeoDataSource, string> | undefined): GeoFeature[] => {
	if (!geo) return builtInMaps.world()

	if ('type' in geo && geo.type === 'FeatureCollection') {
		const fc = geo as GeoJSON.FeatureCollection
		return fc.features.map((f, i) => {
			const props = (f.properties ?? {}) as Record<string, unknown>
			return {
				id: String(f.id ?? props.id ?? i),
				name: String(props.NAME ?? props.name ?? ''),
				geometry: f.geometry,
				properties: props,
			}
		})
	}

	if ('type' in geo && geo.type === 'Topology') {
		return topoToFeatures(geo as Topology)
	}

	return builtInMaps.world()
}

export const resolveGeoPreset = (preset: GeoMapPreset): GeoFeature[] => builtInMaps[preset]()

// ---------------------------------------------------------------------------
// Region filtering
// ---------------------------------------------------------------------------

/** Normalize continent names to match Natural Earth CONTINENT property values */
const CONTINENT_NAMES: Record<string, string> = {
	europe: 'Europe',
	africa: 'Africa',
	asia: 'Asia',
	oceania: 'Oceania',
	'north-america': 'North America',
	'south-america': 'South America',
	antarctica: 'Antarctica',
}

// prettier-ignore
const US_STATE_FIPS: Record<string, string> = {
	AL: '01', AK: '02', AZ: '04', AR: '05', CA: '06', CO: '08', CT: '09', DE: '10',
	FL: '12', GA: '13', HI: '15', ID: '16', IL: '17', IN: '18', IA: '19', KS: '20',
	KY: '21', LA: '22', ME: '23', MD: '24', MA: '25', MI: '26', MN: '27', MS: '28',
	MO: '29', MT: '30', NE: '31', NV: '32', NH: '33', NJ: '34', NM: '35', NY: '36',
	NC: '37', ND: '38', OH: '39', OK: '40', OR: '41', PA: '42', RI: '44', SC: '45',
	SD: '46', TN: '47', TX: '48', UT: '49', VT: '50', VA: '51', WA: '53', WV: '54',
	WI: '55', WY: '56', DC: '11', PR: '72',
}

export const filterFeatures = (features: readonly GeoFeature[], region: GeoRegionFilter): GeoFeature[] => {
	if (typeof region === 'function') return features.filter(region)

	// US state code: "US-TX" → filter counties by FIPS prefix
	const usMatch = region.match(/^us-([a-z]{2})$/i)

	if (usMatch) {
		const fips = US_STATE_FIPS[usMatch[1].toUpperCase()]
		if (fips) return features.filter((f) => f.id.startsWith(fips))
	}

	// Continent filter — match against CONTINENT property from Natural Earth data
	const continentName = CONTINENT_NAMES[region.toLowerCase()]

	if (continentName) {
		return features.filter((f) => f.properties.CONTINENT === continentName)
	}

	return [...features]
}

// ---------------------------------------------------------------------------
// Path generation
// ---------------------------------------------------------------------------

export const buildPathGenerator = (projection: GeoProjection) => {
	return geoPath(projection).digits(2)
}

// ---------------------------------------------------------------------------
// Default projection for preset maps
// ---------------------------------------------------------------------------

export const defaultProjectionForPreset = (preset: GeoMapPreset): GeoProjectionPreset => {
	if (preset === 'us-states' || preset === 'us-counties') return 'albers-usa'
	return 'patterson'
}
