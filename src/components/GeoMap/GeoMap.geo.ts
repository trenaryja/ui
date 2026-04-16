import type { GeoPermissibleObjects, GeoProjection } from 'd3-geo'
import * as d3Geo from 'd3-geo'
import * as d3GeoProjection from 'd3-geo-projection'
import * as R from 'remeda'
import * as topojson from 'topojson-client'
import type { GeometryCollection, Topology } from 'topojson-specification'
import type { GeoDataSource, GeoFeature, GeoProjectionPreset, GeoRegionFilter, GeoZoomState } from './GeoMap.types'

const SPHERE: GeoPermissibleObjects = { type: 'Sphere' }

export type DragBehavior = 'pan' | 'rotate-λ' | 'rotate'

export const projectionTags = ['azimuthal', 'conic', 'cylindrical', 'pseudocylindrical'] as const

export type ProjectionTag = (typeof projectionTags)[number]

type ProjectionMeta = {
	factory: () => GeoProjection
	drag: DragBehavior
	tag: ProjectionTag
}

const projections: Record<GeoProjectionPreset, ProjectionMeta> = {
	'azimuthal-equidistant': { factory: d3Geo.geoAzimuthalEquidistant, drag: 'rotate', tag: 'azimuthal' },
	gnomonic: { factory: d3Geo.geoGnomonic, drag: 'rotate', tag: 'azimuthal' },
	orthographic: { factory: d3Geo.geoOrthographic, drag: 'rotate', tag: 'azimuthal' },
	satellite: { factory: () => d3GeoProjection.geoSatellite(), drag: 'rotate', tag: 'azimuthal' },
	stereographic: { factory: d3Geo.geoStereographic, drag: 'rotate', tag: 'azimuthal' },
	'albers-usa': { factory: d3Geo.geoAlbersUsa, drag: 'pan', tag: 'conic' },
	equirectangular: { factory: d3Geo.geoEquirectangular, drag: 'rotate-λ', tag: 'cylindrical' },
	mercator: { factory: d3Geo.geoMercator, drag: 'rotate-λ', tag: 'cylindrical' },
	miller: { factory: () => d3GeoProjection.geoMiller(), drag: 'rotate-λ', tag: 'cylindrical' },
	'equal-earth': { factory: () => d3Geo.geoEqualEarth(), drag: 'rotate-λ', tag: 'pseudocylindrical' },
	hammer: { factory: () => d3GeoProjection.geoHammer(), drag: 'rotate-λ', tag: 'pseudocylindrical' },
	kavrayskiy7: { factory: () => d3GeoProjection.geoKavrayskiy7(), drag: 'rotate-λ', tag: 'pseudocylindrical' },
	mollweide: { factory: () => d3GeoProjection.geoMollweide(), drag: 'rotate-λ', tag: 'pseudocylindrical' },
	'natural-earth': { factory: d3Geo.geoNaturalEarth1, drag: 'rotate-λ', tag: 'pseudocylindrical' },
	patterson: { factory: () => d3GeoProjection.geoPatterson(), drag: 'rotate-λ', tag: 'pseudocylindrical' },
	robinson: { factory: () => d3GeoProjection.geoRobinson(), drag: 'rotate-λ', tag: 'pseudocylindrical' },
	winkel3: { factory: () => d3GeoProjection.geoWinkel3(), drag: 'rotate-λ', tag: 'pseudocylindrical' },
}

export const getDragBehavior = (preset: GeoProjectionPreset | undefined): DragBehavior =>
	preset ? projections[preset].drag : 'pan'

export const getProjectionTag = (preset: GeoProjectionPreset): ProjectionTag => projections[preset].tag

export const getProjectionsByTag = () => {
	const grouped = R.groupBy(R.keys(projections), (name) => projections[name].tag)
	for (const presets of Object.values(grouped)) presets.sort()
	return grouped as Record<ProjectionTag, GeoProjectionPreset[]>
}

export const resolveProjection = (
	preset: ((width: number, height: number) => GeoProjection) | GeoProjectionPreset | undefined,
	width: number,
	height: number,
): GeoProjection => {
	if (typeof preset === 'function') return preset(width, height)
	return projections[preset ?? 'patterson'].factory().fitSize([width, height], SPHERE).precision(0.1)
}

const aspectRatioCache = new Map<'default' | GeoProjectionPreset, number>()

export const getProjectionAspectRatio = (
	preset: ((width: number, height: number) => GeoProjection) | GeoProjectionPreset | undefined,
): number => {
	const key: 'default' | GeoProjectionPreset = typeof preset === 'string' ? preset : 'default'

	if (typeof preset !== 'function') {
		const cached = aspectRatioCache.get(key)
		if (cached !== undefined) return cached
	}

	const projection = resolveProjection(preset, 1000, 1000)
	const [[x0, y0], [x1, y1]] = d3Geo.geoPath(projection).bounds(SPHERE)
	const ratio = (x1 - x0) / (y1 - y0)
	if (typeof preset !== 'function') aspectRatioCache.set(key, ratio)
	return ratio
}

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

export const resolveGeoData = (geo: Exclude<GeoDataSource, string>): GeoFeature[] => {
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
	if ('type' in geo && geo.type === 'Topology') return topoToFeatures(geo as Topology)
	return []
}

export type GeoMapPreset = 'us-counties' | 'us-states' | 'world'

type TopoModule = { default: unknown }

const topoLoaders: Record<GeoMapPreset, () => Promise<TopoModule>> = {
	world: () => import('@/data/geo/world-110m.topo.json'),
	'us-states': () => import('@/data/geo/us-states.topo.json'),
	'us-counties': () => import('@/data/geo/us-counties.topo.json'),
}

const topoObjectNames: Record<GeoMapPreset, string> = {
	world: 'countries',
	'us-states': 'states',
	'us-counties': 'counties',
}

const presetDefaultProjection: Record<GeoMapPreset, GeoProjectionPreset> = {
	world: 'patterson',
	'us-states': 'albers-usa',
	'us-counties': 'albers-usa',
}

export const isGeoMapPreset = (v: unknown): v is GeoMapPreset => typeof v === 'string' && v in topoLoaders

export const defaultProjectionForPreset = (preset: GeoMapPreset) => presetDefaultProjection[preset]

export const loadPresetFeatures = async (preset: GeoMapPreset): Promise<GeoFeature[]> => {
	const mod = await topoLoaders[preset]()
	return topoToFeatures(mod.default as Topology, topoObjectNames[preset])
}

const CONTINENT_NAMES: Record<string, string> = {
	africa: 'Africa',
	antarctica: 'Antarctica',
	asia: 'Asia',
	europe: 'Europe',
	'north-america': 'North America',
	oceania: 'Oceania',
	'south-america': 'South America',
}

// prettier-ignore
const US_STATE_FIPS: Record<string, string> = {
	AL: '01', AK: '02', AZ: '04', AR: '05', CA: '06', CO: '08', CT: '09', DE: '10',
	DC: '11', FL: '12', GA: '13', HI: '15', ID: '16', IL: '17', IN: '18', IA: '19',
	KS: '20', KY: '21', LA: '22', ME: '23', MD: '24', MA: '25', MI: '26', MN: '27',
	MS: '28', MO: '29', MT: '30', NE: '31', NV: '32', NH: '33', NJ: '34', NM: '35',
	NY: '36', NC: '37', ND: '38', OH: '39', OK: '40', OR: '41', PA: '42', RI: '44',
	SC: '45', SD: '46', TN: '47', TX: '48', UT: '49', VT: '50', VA: '51', WA: '53',
	WV: '54', WI: '55', WY: '56', PR: '72',
}

export const filterFeatures = (features: readonly GeoFeature[], region: GeoRegionFilter): GeoFeature[] => {
	if (typeof region === 'function') return features.filter(region)

	const usMatch = region.match(/^us-([a-z]{2})$/i)

	if (usMatch) {
		const fips = US_STATE_FIPS[usMatch[1].toUpperCase()]
		if (fips) return features.filter((f) => f.id.startsWith(fips))
	}

	const continentName = CONTINENT_NAMES[region.toLowerCase()]
	if (continentName) return features.filter((f) => f.properties.CONTINENT === continentName)

	return [...features]
}

export const buildPathGenerator = (projection: GeoProjection) => d3Geo.geoPath(projection).digits(2)

export const getFeatureZoom = ({
	feature,
	pathGenerator,
	projection,
	width,
	height,
	padding = 0.9,
}: {
	feature: GeoFeature
	pathGenerator: ReturnType<typeof buildPathGenerator>
	projection: GeoProjection
	width: number
	height: number
	/** Fraction of the viewport the feature should fill. Defaults to 0.9 (5% margin per side). */
	padding?: number
}): GeoZoomState => {
	const [[x0, y0], [x1, y1]] = pathGenerator.bounds(feature.geometry)
	const dx = x1 - x0
	const dy = y1 - y0
	const scale = padding * Math.min(width / dx, height / dy)
	const center = projection.invert?.([(x0 + x1) / 2, (y0 + y1) / 2]) ?? [0, 0]
	return { scale, center: [center[0], center[1]] }
}
