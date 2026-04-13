import type { GeoPermissibleObjects, GeoProjection } from 'd3-geo'
import * as d3Geo from 'd3-geo'
import * as d3GeoProjection from 'd3-geo-projection'
import * as topojson from 'topojson-client'
import type { GeometryCollection, Topology } from 'topojson-specification'
import type { GeoDataSource, GeoFeature, GeoProjectionPreset, GeoRegionFilter } from './GeoMap.types'

// ---------------------------------------------------------------------------
// Projection factories — maps kebab-case preset names to d3 factory functions
// ---------------------------------------------------------------------------

type ProjFactory = () => GeoProjection

// prettier-ignore
const projectionFactories: Record<GeoProjectionPreset, ProjFactory> = {
	// d3-geo (direct references where signatures already match)
	'albers-usa': d3Geo.geoAlbersUsa,
	'azimuthal-equidistant': d3Geo.geoAzimuthalEquidistant,
	'conic-conformal': d3Geo.geoConicConformal,
	'conic-equidistant': d3Geo.geoConicEquidistant,
	'equal-earth': () => d3Geo.geoEqualEarth(),
	equirectangular: d3Geo.geoEquirectangular,
	gnomonic: d3Geo.geoGnomonic,
	mercator: d3Geo.geoMercator,
	'natural-earth': d3Geo.geoNaturalEarth1,
	orthographic: d3Geo.geoOrthographic,
	stereographic: d3Geo.geoStereographic,
	'transverse-mercator': d3Geo.geoTransverseMercator,
	// d3-geo-projection (wrapped — factories have extra optional params or return subtypes)
	airy: () => d3GeoProjection.geoAiry(),
	aitoff: () => d3GeoProjection.geoAitoff(),
	armadillo: () => d3GeoProjection.geoArmadillo(),
	august: () => d3GeoProjection.geoAugust(),
	baker: () => d3GeoProjection.geoBaker(),
	berghaus: () => d3GeoProjection.geoBerghaus(),
	bertin1953: () => d3GeoProjection.geoBertin1953(),
	boggs: () => d3GeoProjection.geoBoggs(),
	bonne: () => d3GeoProjection.geoBonne(),
	bottomley: () => d3GeoProjection.geoBottomley(),
	bromley: () => d3GeoProjection.geoBromley(),
	collignon: () => d3GeoProjection.geoCollignon(),
	craster: () => d3GeoProjection.geoCraster(),
	'cylindrical-equal-area': () => d3GeoProjection.geoCylindricalEqualArea(),
	'cylindrical-stereographic': () => d3GeoProjection.geoCylindricalStereographic(),
	eckert1: () => d3GeoProjection.geoEckert1(),
	eckert2: () => d3GeoProjection.geoEckert2(),
	eckert3: () => d3GeoProjection.geoEckert3(),
	eckert4: () => d3GeoProjection.geoEckert4(),
	eckert5: () => d3GeoProjection.geoEckert5(),
	eckert6: () => d3GeoProjection.geoEckert6(),
	eisenlohr: () => d3GeoProjection.geoEisenlohr(),
	fahey: () => d3GeoProjection.geoFahey(),
	gilbert: () => d3GeoProjection.geoGilbert(),
	gingery: () => d3GeoProjection.geoGingery(),
	ginzburg4: () => d3GeoProjection.geoGinzburg4(),
	ginzburg5: () => d3GeoProjection.geoGinzburg5(),
	ginzburg6: () => d3GeoProjection.geoGinzburg6(),
	ginzburg8: () => d3GeoProjection.geoGinzburg8(),
	ginzburg9: () => d3GeoProjection.geoGinzburg9(),
	gringorten: () => d3GeoProjection.geoGringorten(),
	hammer: () => d3GeoProjection.geoHammer(),
	healpix: () => d3GeoProjection.geoHealpix(),
	hill: () => d3GeoProjection.geoHill(),
	homolosine: () => d3GeoProjection.geoHomolosine(),
	hufnagel: () => d3GeoProjection.geoHufnagel(),
	'interrupted-boggs': () => d3GeoProjection.geoInterruptedBoggs(),
	'interrupted-homolosine': () => d3GeoProjection.geoInterruptedHomolosine(),
	'interrupted-mollweide': () => d3GeoProjection.geoInterruptedMollweide(),
	'interrupted-mollweide-hemispheres': () => d3GeoProjection.geoInterruptedMollweideHemispheres(),
	'interrupted-sinu-mollweide': () => d3GeoProjection.geoInterruptedSinuMollweide(),
	'interrupted-sinusoidal': () => d3GeoProjection.geoInterruptedSinusoidal(),
	kavrayskiy7: () => d3GeoProjection.geoKavrayskiy7(),
	lagrange: () => d3GeoProjection.geoLagrange(),
	larrivee: () => d3GeoProjection.geoLarrivee(),
	laskowski: () => d3GeoProjection.geoLaskowski(),
	loximuthal: () => d3GeoProjection.geoLoximuthal(),
	miller: () => d3GeoProjection.geoMiller(),
	mollweide: () => d3GeoProjection.geoMollweide(),
	'mt-flat-polar-parabolic': () => d3GeoProjection.geoMtFlatPolarParabolic(),
	'mt-flat-polar-quartic': () => d3GeoProjection.geoMtFlatPolarQuartic(),
	'mt-flat-polar-sinusoidal': () => d3GeoProjection.geoMtFlatPolarSinusoidal(),
	'natural-earth2': () => d3GeoProjection.geoNaturalEarth2(),
	'nell-hammer': () => d3GeoProjection.geoNellHammer(),
	nicolosi: () => d3GeoProjection.geoNicolosi(),
	patterson: () => d3GeoProjection.geoPatterson(),
	polyconic: () => d3GeoProjection.geoPolyconic(),
	'rectangular-polyconic': () => d3GeoProjection.geoRectangularPolyconic(),
	robinson: () => d3GeoProjection.geoRobinson(),
	satellite: () => d3GeoProjection.geoSatellite(),
	'sinu-mollweide': () => d3GeoProjection.geoSinuMollweide(),
	sinusoidal: () => d3GeoProjection.geoSinusoidal(),
	times: () => d3GeoProjection.geoTimes(),
	'van-der-grinten': () => d3GeoProjection.geoVanDerGrinten(),
	'van-der-grinten2': () => d3GeoProjection.geoVanDerGrinten2(),
	'van-der-grinten3': () => d3GeoProjection.geoVanDerGrinten3(),
	'van-der-grinten4': () => d3GeoProjection.geoVanDerGrinten4(),
	wagner4: () => d3GeoProjection.geoWagner4(),
	wagner6: () => d3GeoProjection.geoWagner6(),
	wagner7: () => d3GeoProjection.geoWagner7(),
	wiechel: () => d3GeoProjection.geoWiechel(),
	winkel3: () => d3GeoProjection.geoWinkel3(),
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
// Built-in map presets — dynamic imports so each TopoJSON becomes its own chunk
// ---------------------------------------------------------------------------

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

export const isGeoMapPreset = (v: unknown): v is GeoMapPreset => typeof v === 'string' && v in topoLoaders

export const loadPresetFeatures = async (preset: GeoMapPreset): Promise<GeoFeature[]> => {
	const mod = await topoLoaders[preset]()
	return topoToFeatures(mod.default as Topology, topoObjectNames[preset])
}

// ---------------------------------------------------------------------------
// Resolve inline geo data (FeatureCollection or Topology) → GeoFeature[]
// ---------------------------------------------------------------------------

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

	if ('type' in geo && geo.type === 'Topology') {
		return topoToFeatures(geo as Topology)
	}

	return []
}

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
	return d3Geo.geoPath(projection).digits(2)
}

// ---------------------------------------------------------------------------
// Default projection for preset maps
// ---------------------------------------------------------------------------

export const defaultProjectionForPreset = (preset: GeoMapPreset): GeoProjectionPreset => {
	if (preset === 'us-states' || preset === 'us-counties') return 'albers-usa'
	return 'patterson'
}
