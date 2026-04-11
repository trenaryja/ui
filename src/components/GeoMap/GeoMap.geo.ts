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
	// d3-geo
	'albers-usa': d3Geo.geoAlbersUsa,
	'azimuthal-equidistant': d3Geo.geoAzimuthalEquidistant,
	'conic-conformal': d3Geo.geoConicConformal,
	'conic-equidistant': d3Geo.geoConicEquidistant,
	'equal-earth': d3Geo.geoEqualEarth as ProjFactory,
	equirectangular: d3Geo.geoEquirectangular,
	gnomonic: d3Geo.geoGnomonic,
	mercator: d3Geo.geoMercator,
	'natural-earth': d3Geo.geoNaturalEarth1,
	orthographic: d3Geo.geoOrthographic,
	stereographic: d3Geo.geoStereographic,
	'transverse-mercator': d3Geo.geoTransverseMercator,
	// d3-geo-projection
	airy: d3GeoProjection.geoAiry as ProjFactory,
	aitoff: d3GeoProjection.geoAitoff as ProjFactory,
	armadillo: d3GeoProjection.geoArmadillo as ProjFactory,
	august: d3GeoProjection.geoAugust as ProjFactory,
	baker: d3GeoProjection.geoBaker as ProjFactory,
	berghaus: d3GeoProjection.geoBerghaus as ProjFactory,
	bertin1953: d3GeoProjection.geoBertin1953 as ProjFactory,
	boggs: d3GeoProjection.geoBoggs as ProjFactory,
	bonne: d3GeoProjection.geoBonne as ProjFactory,
	bottomley: d3GeoProjection.geoBottomley as ProjFactory,
	bromley: d3GeoProjection.geoBromley as ProjFactory,
	collignon: d3GeoProjection.geoCollignon as ProjFactory,
	craster: d3GeoProjection.geoCraster as ProjFactory,
	'cylindrical-equal-area': d3GeoProjection.geoCylindricalEqualArea as ProjFactory,
	'cylindrical-stereographic': d3GeoProjection.geoCylindricalStereographic as ProjFactory,
	eckert1: d3GeoProjection.geoEckert1 as ProjFactory,
	eckert2: d3GeoProjection.geoEckert2 as ProjFactory,
	eckert3: d3GeoProjection.geoEckert3 as ProjFactory,
	eckert4: d3GeoProjection.geoEckert4 as ProjFactory,
	eckert5: d3GeoProjection.geoEckert5 as ProjFactory,
	eckert6: d3GeoProjection.geoEckert6 as ProjFactory,
	eisenlohr: d3GeoProjection.geoEisenlohr as ProjFactory,
	fahey: d3GeoProjection.geoFahey as ProjFactory,
	gilbert: d3GeoProjection.geoGilbert as ProjFactory,
	gingery: d3GeoProjection.geoGingery as ProjFactory,
	ginzburg4: d3GeoProjection.geoGinzburg4 as ProjFactory,
	ginzburg5: d3GeoProjection.geoGinzburg5 as ProjFactory,
	ginzburg6: d3GeoProjection.geoGinzburg6 as ProjFactory,
	ginzburg8: d3GeoProjection.geoGinzburg8 as ProjFactory,
	ginzburg9: d3GeoProjection.geoGinzburg9 as ProjFactory,
	gringorten: d3GeoProjection.geoGringorten as ProjFactory,
	hammer: d3GeoProjection.geoHammer as ProjFactory,
	healpix: d3GeoProjection.geoHealpix as ProjFactory,
	hill: d3GeoProjection.geoHill as ProjFactory,
	homolosine: d3GeoProjection.geoHomolosine as ProjFactory,
	hufnagel: d3GeoProjection.geoHufnagel as ProjFactory,
	'interrupted-boggs': d3GeoProjection.geoInterruptedBoggs as ProjFactory,
	'interrupted-homolosine': d3GeoProjection.geoInterruptedHomolosine as ProjFactory,
	'interrupted-mollweide': d3GeoProjection.geoInterruptedMollweide as ProjFactory,
	'interrupted-mollweide-hemispheres': d3GeoProjection.geoInterruptedMollweideHemispheres as ProjFactory,
	'interrupted-sinu-mollweide': d3GeoProjection.geoInterruptedSinuMollweide as ProjFactory,
	'interrupted-sinusoidal': d3GeoProjection.geoInterruptedSinusoidal as ProjFactory,
	kavrayskiy7: d3GeoProjection.geoKavrayskiy7 as ProjFactory,
	lagrange: d3GeoProjection.geoLagrange as ProjFactory,
	larrivee: d3GeoProjection.geoLarrivee as ProjFactory,
	laskowski: d3GeoProjection.geoLaskowski as ProjFactory,
	loximuthal: d3GeoProjection.geoLoximuthal as ProjFactory,
	miller: d3GeoProjection.geoMiller as ProjFactory,
	mollweide: d3GeoProjection.geoMollweide as ProjFactory,
	'mt-flat-polar-parabolic': d3GeoProjection.geoMtFlatPolarParabolic as ProjFactory,
	'mt-flat-polar-quartic': d3GeoProjection.geoMtFlatPolarQuartic as ProjFactory,
	'mt-flat-polar-sinusoidal': d3GeoProjection.geoMtFlatPolarSinusoidal as ProjFactory,
	'natural-earth2': d3GeoProjection.geoNaturalEarth2 as ProjFactory,
	'nell-hammer': d3GeoProjection.geoNellHammer as ProjFactory,
	nicolosi: d3GeoProjection.geoNicolosi as ProjFactory,
	patterson: d3GeoProjection.geoPatterson as ProjFactory,
	polyconic: d3GeoProjection.geoPolyconic as ProjFactory,
	'rectangular-polyconic': d3GeoProjection.geoRectangularPolyconic as ProjFactory,
	robinson: d3GeoProjection.geoRobinson as ProjFactory,
	satellite: d3GeoProjection.geoSatellite as ProjFactory,
	'sinu-mollweide': d3GeoProjection.geoSinuMollweide as ProjFactory,
	sinusoidal: d3GeoProjection.geoSinusoidal as ProjFactory,
	times: d3GeoProjection.geoTimes as ProjFactory,
	'van-der-grinten': d3GeoProjection.geoVanDerGrinten as ProjFactory,
	'van-der-grinten2': d3GeoProjection.geoVanDerGrinten2 as ProjFactory,
	'van-der-grinten3': d3GeoProjection.geoVanDerGrinten3 as ProjFactory,
	'van-der-grinten4': d3GeoProjection.geoVanDerGrinten4 as ProjFactory,
	wagner4: d3GeoProjection.geoWagner4 as ProjFactory,
	wagner6: d3GeoProjection.geoWagner6 as ProjFactory,
	wagner7: d3GeoProjection.geoWagner7 as ProjFactory,
	wiechel: d3GeoProjection.geoWiechel as ProjFactory,
	winkel3: d3GeoProjection.geoWinkel3 as ProjFactory,
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
