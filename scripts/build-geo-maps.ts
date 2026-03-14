import type { GeoPermissibleObjects, GeoProjection } from 'd3-geo'
import { geoAlbersUsa, geoPath } from 'd3-geo'
import { geoPatterson } from 'd3-geo-projection'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { dataDir, log } from './utils'

const OUT_DIR = path.join(dataDir, 'svg-geo-maps')

const GEO_JSON_SRC = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson'

type GeoFeature = {
	type: 'Feature'
	properties: Record<string, string>
	geometry: GeoPermissibleObjects
}

type FeatureCollection = {
	type: 'FeatureCollection'
	features: GeoFeature[]
}

type MapConfig = {
	name: string
	label: string
	url: string
	width: number
	height: number
	projection: () => GeoProjection
	filter?: (f: GeoFeature) => boolean
	toLocation: (f: GeoFeature) => { id: string; name: string }
}

const maps: MapConfig[] = [
	{
		name: 'usa',
		label: 'Map of USA',
		url: `${GEO_JSON_SRC}/ne_50m_admin_1_states_provinces_lakes.geojson`,
		width: 930,
		height: 593,
		projection: geoAlbersUsa,
		filter: (f) => f.properties.iso_a2 === 'US' && f.properties.type_en === 'State',
		toLocation: (f) => ({
			id: (f.properties.iso_3166_2?.toLowerCase() ?? '').replace('us-', ''),
			name: f.properties.name ?? '',
		}),
	},
	{
		name: 'world',
		label: 'Map of the World',
		url: `${GEO_JSON_SRC}/ne_110m_admin_0_countries.geojson`,
		width: 1010,
		height: 666,
		projection: geoPatterson,
		toLocation: (f) => {
			const p = f.properties
			const iso =
				p.ISO_A2 && p.ISO_A2 !== '-99'
					? p.ISO_A2
					: p.ISO_A2_EH && p.ISO_A2_EH !== '-99'
						? p.ISO_A2_EH
						: (p.ADM0_A3 ?? '').slice(0, 2)
			return { id: (iso ?? '').toLowerCase(), name: p.NAME ?? p.ADMIN ?? '' }
		},
	},
]

const fetchJson = async <T>(url: string): Promise<T> => {
	const res = await fetch(url)
	if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
	return res.json() as Promise<T>
}

const generateMap = async ({ name, label, url, width, height, projection, filter, toLocation }: MapConfig) => {
	log(`Generating ${name}...`)
	const data = await fetchJson<FeatureCollection>(url)
	const features = filter ? data.features.filter(filter) : data.features

	const margin = 2
	const collection = { type: 'FeatureCollection' as const, features }
	const proj = projection().fitExtent(
		[
			[margin, margin],
			[width - margin, height - margin],
		],
		collection as unknown as GeoPermissibleObjects,
	)
	const pathGen = geoPath(proj).digits(2)

	const locations = features
		.map((f) => ({
			...toLocation(f),
			path: pathGen(f.geometry) ?? '',
		}))
		.filter((l) => l.path)
		.sort((a, b) => a.id.localeCompare(b.id))

	const locs = locations
		.map((l) => `  { id: ${JSON.stringify(l.id)}, name: ${JSON.stringify(l.name)}, path: ${JSON.stringify(l.path)} }`)
		.join(',\n')

	const raw = `// Auto-generated — do not edit
export const ${name} = {
  label: ${JSON.stringify(label)},
  viewBox: ${JSON.stringify(`0 0 ${width} ${height}`)},
  locations: [
${locs}
  ],
} as const
`

	const filepath = path.join(OUT_DIR, `${name}.svg-map.ts`)
	fs.writeFileSync(filepath, raw, 'utf-8')
	execSync(`prettier --write "${filepath}"`, { stdio: 'ignore' })
	log(`${name}.svg-map.ts (${locations.length} locations)`)
}

const main = async () => {
	fs.mkdirSync(OUT_DIR, { recursive: true })
	await maps.reduce((p, map) => p.then(() => generateMap(map)), Promise.resolve())
	log('Done!')
}

await main()
