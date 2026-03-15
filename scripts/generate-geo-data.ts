/**
 * Script to generate TopoJSON data files for the GeoMap component.
 * Run idempotently: `bun scripts/generate-geo-data.ts`
 *
 * Sources:
 *   - World countries: Natural Earth 110m admin 0
 *   - US states: Natural Earth 50m admin 1 (filtered to US)
 *   - US counties: US Census Bureau TIGER/Line via us-atlas (Natural Earth doesn't have county data)
 *
 * The us-atlas counties file is simplified to reduce file size and improve
 * rendering performance (~3200 paths). The original 10m resolution has far
 * more detail than needed at national zoom levels.
 */

import fs from 'fs'
import path from 'path'
import * as topojsonServer from 'topojson-server'
import * as topojsonClient from 'topojson-client'
import { dataDir, log } from './utils'

const OUT_DIR = path.join(dataDir, 'geo')

const NE_BASE = 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson'
const US_ATLAS_COUNTIES = 'https://cdn.jsdelivr.net/npm/us-atlas@3/counties-10m.json'

type GeoFeature = {
	type: 'Feature'
	id?: number | string
	properties: Record<string, unknown>
	geometry: unknown
}

type FeatureCollection = {
	type: 'FeatureCollection'
	features: GeoFeature[]
}

const fetchJson = async <T>(url: string): Promise<T> => {
	log(`Fetching ${url}...`)
	const res = await fetch(url)
	if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
	return res.json() as Promise<T>
}

const writeTopology = (filePath: string, topology: unknown, count: number) => {
	fs.writeFileSync(filePath, JSON.stringify(topology), 'utf-8')
	const kb = (fs.statSync(filePath).size / 1024).toFixed(0)
	log(`${path.basename(filePath)} (${count} features, ${kb}KB)`)
}

/** Pick only the properties we care about to keep file size reasonable */
const pickWorldProps = (props: Record<string, unknown>) => ({
	NAME: props.NAME,
	NAME_LONG: props.NAME_LONG,
	ABBREV: props.ABBREV,
	POSTAL: props.POSTAL,
	ISO_A2: props.ISO_A2,
	ISO_A2_EH: props.ISO_A2_EH,
	ISO_A3: props.ISO_A3,
	ISO_N3: props.ISO_N3,
	CONTINENT: props.CONTINENT,
	REGION_UN: props.REGION_UN,
	SUBREGION: props.SUBREGION,
	POP_EST: props.POP_EST,
	GDP_MD: props.GDP_MD,
	INCOME_GRP: props.INCOME_GRP,
	MAPCOLOR7: props.MAPCOLOR7,
	MAPCOLOR9: props.MAPCOLOR9,
})

const pickStateProps = (props: Record<string, unknown>) => ({
	name: props.name,
	iso_3166_2: props.iso_3166_2,
	iso_a2: props.iso_a2,
	type_en: props.type_en,
	region: props.region,
	region_sub: props.region_sub,
	postal: props.postal,
	fips: props.fips,
	latitude: props.latitude,
	longitude: props.longitude,
})

const generateWorld = async () => {
	log('Generating world countries...')
	const data = await fetchJson<FeatureCollection>(`${NE_BASE}/ne_110m_admin_0_countries.geojson`)

	data.features = data.features.map((f, i) => {
		const p = f.properties
		const iso2 = p.ISO_A2_EH && p.ISO_A2_EH !== '-99' ? p.ISO_A2_EH : p.ISO_A2 && p.ISO_A2 !== '-99' ? p.ISO_A2 : null
		return {
			...f,
			id: iso2 ? String(iso2).toLowerCase() : `_unknown_${i}`,
			properties: pickWorldProps(p),
		}
	})

	const topology = topojsonServer.topology({ countries: data })
	writeTopology(path.join(OUT_DIR, 'world-110m.topo.json'), topology, data.features.length)
}

const generateUsStates = async () => {
	log('Generating US states...')
	const data = await fetchJson<FeatureCollection>(`${NE_BASE}/ne_50m_admin_1_states_provinces_lakes.geojson`)

	data.features = data.features
		.filter((f) => f.properties.iso_a2 === 'US' && f.properties.type_en === 'State')
		.map((f) => ({
			...f,
			id: String(f.properties.postal ?? '').toLowerCase(),
			properties: pickStateProps(f.properties),
		}))

	const topology = topojsonServer.topology({ states: data })
	writeTopology(path.join(OUT_DIR, 'us-states.topo.json'), topology, data.features.length)
}

const generateUsCounties = async () => {
	log('Generating US counties...')
	const topology = await fetchJson<Record<string, unknown>>(US_ATLAS_COUNTIES)

	// The us-atlas 10m file is already quantized, but we can re-process it
	// to reduce coordinate precision. Convert to GeoJSON, then back to TopoJSON
	// with a lower quantization to reduce file size and improve render performance.
	const topo = topology as unknown as import('topojson-specification').Topology
	const countiesFC = topojsonClient.feature(
		topo,
		topo.objects.counties as import('topojson-specification').GeometryCollection,
	)
	const statesFC = topojsonClient.feature(
		topo,
		topo.objects.states as import('topojson-specification').GeometryCollection,
	)

	// Re-build topology from GeoJSON with lower quantization (1e4 vs default 1e6).
	// This reduces coordinate precision, yielding smaller arcs and faster SVG path generation.
	// The original 10m file uses 1e6 quantization which is far more detail than needed.
	const rebuilt = topojsonServer.topology({ counties: countiesFC, states: statesFC }, 1e4)

	const { objects } = rebuilt as unknown as { objects: Record<string, { geometries: unknown[] }> }
	const count = objects.counties?.geometries?.length ?? 0

	writeTopology(path.join(OUT_DIR, 'us-counties.topo.json'), rebuilt, count)
}

const main = async () => {
	fs.mkdirSync(OUT_DIR, { recursive: true })
	await generateWorld()
	await generateUsStates()
	await generateUsCounties()
	log('Done!')
}

await main()
