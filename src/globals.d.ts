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

	export function geoPatterson(): GeoProjection
}
