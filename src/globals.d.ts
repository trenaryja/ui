declare module '*?raw' {
	const content: string
	export default content
}

declare module 'topojson-simplify' {
	export function presimplify(topology: unknown): unknown
	export function simplify(topology: unknown, minWeight?: number): unknown
	export function filter(topology: unknown, filter: (ring: unknown) => boolean): unknown
	export function filterWeight(minWeight: number): (ring: unknown) => boolean
}

declare module 'topojson-server' {
	import type { Topology } from 'topojson-specification'

	export function topology(objects: Record<string, GeoJSON.GeoJsonObject>, quantize?: number): Topology
}

declare module 'd3-geo-projection' {
	import type { GeoProjection } from 'd3-geo'

	// Each named export is a projection factory
	export function geoAiry(): GeoProjection
	export function geoAitoff(): GeoProjection
	export function geoArmadillo(): GeoProjection
	export function geoAugust(): GeoProjection
	export function geoBaker(): GeoProjection
	export function geoBerghaus(): GeoProjection
	export function geoBertin1953(): GeoProjection
	export function geoBoggs(): GeoProjection
	export function geoBonne(): GeoProjection
	export function geoBottomley(): GeoProjection
	export function geoBromley(): GeoProjection
	export function geoCollignon(): GeoProjection
	export function geoCraster(): GeoProjection
	export function geoCylindricalEqualArea(): GeoProjection
	export function geoCylindricalStereographic(): GeoProjection
	export function geoEckert1(): GeoProjection
	export function geoEckert2(): GeoProjection
	export function geoEckert3(): GeoProjection
	export function geoEckert4(): GeoProjection
	export function geoEckert5(): GeoProjection
	export function geoEckert6(): GeoProjection
	export function geoEisenlohr(): GeoProjection
	export function geoFahey(): GeoProjection
	export function geoGilbert(): GeoProjection
	export function geoGingery(): GeoProjection
	export function geoGinzburg4(): GeoProjection
	export function geoGinzburg5(): GeoProjection
	export function geoGinzburg6(): GeoProjection
	export function geoGinzburg8(): GeoProjection
	export function geoGinzburg9(): GeoProjection
	export function geoGringorten(): GeoProjection
	export function geoHammer(): GeoProjection
	export function geoHealpix(): GeoProjection
	export function geoHill(): GeoProjection
	export function geoHomolosine(): GeoProjection
	export function geoHufnagel(): GeoProjection
	export function geoInterruptedBoggs(): GeoProjection
	export function geoInterruptedHomolosine(): GeoProjection
	export function geoInterruptedMollweide(): GeoProjection
	export function geoInterruptedMollweideHemispheres(): GeoProjection
	export function geoInterruptedSinuMollweide(): GeoProjection
	export function geoInterruptedSinusoidal(): GeoProjection
	export function geoKavrayskiy7(): GeoProjection
	export function geoLagrange(): GeoProjection
	export function geoLarrivee(): GeoProjection
	export function geoLaskowski(): GeoProjection
	export function geoLoximuthal(): GeoProjection
	export function geoMiller(): GeoProjection
	export function geoMollweide(): GeoProjection
	export function geoMtFlatPolarParabolic(): GeoProjection
	export function geoMtFlatPolarQuartic(): GeoProjection
	export function geoMtFlatPolarSinusoidal(): GeoProjection
	export function geoNaturalEarth2(): GeoProjection
	export function geoNellHammer(): GeoProjection
	export function geoNicolosi(): GeoProjection
	export function geoPatterson(): GeoProjection
	export function geoPolyconic(): GeoProjection
	export function geoRectangularPolyconic(): GeoProjection
	export function geoRobinson(): GeoProjection
	export function geoSatellite(): GeoProjection
	export function geoSinuMollweide(): GeoProjection
	export function geoSinusoidal(): GeoProjection
	export function geoTimes(): GeoProjection
	export function geoVanDerGrinten(): GeoProjection
	export function geoVanDerGrinten2(): GeoProjection
	export function geoVanDerGrinten3(): GeoProjection
	export function geoVanDerGrinten4(): GeoProjection
	export function geoWagner4(): GeoProjection
	export function geoWagner6(): GeoProjection
	export function geoWagner7(): GeoProjection
	export function geoWiechel(): GeoProjection
	export function geoWinkel3(): GeoProjection
}
