import { interpolateColors } from '@/utils'
import type { GeoPermissibleObjects, GeoProjection } from 'd3-geo'
import * as d3Geo from 'd3-geo'
import * as d3GeoProjection from 'd3-geo-projection'
import * as R from 'remeda'
import * as topojson from 'topojson-client'
import type { GeometryCollection, Topology } from 'topojson-specification'
import type {
	ChoroplethConfig,
	GeoDataSource,
	GeoLegendItem,
	GeoPoint,
	GeoProjectionPreset,
	GeoRegion,
	GeoRegionFilter,
	GeoZoomState,
	NamedFeature,
} from './GeoMap.types'
import { resolvePointCoord } from './GeoMap.points.utils'

const SPHERE: GeoPermissibleObjects = { type: 'Sphere' }

export type DragBehavior = 'pan' | 'rotate-λ' | 'rotate'

export const projectionTags = ['azimuthal', 'conic', 'cylindrical', 'pseudocylindrical'] as const

export type ProjectionTag = (typeof projectionTags)[number]

type ProjectionMeta = { factory: () => GeoProjection; drag: DragBehavior; tag: ProjectionTag }

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
) => {
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

/**
 * Normalize a `GeoJSON.Feature` into a `NamedFeature`: stringifies `id` (with fallback)
 * and hoists `name` from `properties.name` or `properties.NAME`. Generic over geometry
 * and properties so it serves regions, points, and lines from one definition.
 */
export const normalizeFeature = <G extends GeoJSON.Geometry | null, P extends Record<string, unknown>>(
	f: GeoJSON.Feature<G, P | null>,
	i: number,
	fallbackPrefix: string,
): NamedFeature<G, P> => {
	const props = (f.properties ?? ({} as P)) as P & { id?: unknown; name?: unknown; NAME?: unknown }
	const rawId = f.id ?? props.id
	return {
		...f,
		id: rawId != null ? String(rawId) : `${fallbackPrefix}${i}`,
		name: String(props.NAME ?? props.name ?? ''),
		properties: props,
	}
}

const topoToRegions = (topology: Topology, objectName?: string): GeoRegion[] => {
	const name = objectName ?? Object.keys(topology.objects)[0]
	const obj = topology.objects[name] as GeometryCollection
	return topojson
		.feature(topology, obj)
		.features.map((f, i) =>
			normalizeFeature(f as GeoJSON.Feature<GeoJSON.MultiPolygon | GeoJSON.Polygon>, i, `_${name}_`),
		)
}

export const resolveGeoData = (geo: Exclude<GeoDataSource, string>): GeoRegion[] => {
	if ('type' in geo && geo.type === 'FeatureCollection')
		return (geo as GeoJSON.FeatureCollection).features.map((f, i) =>
			normalizeFeature(f as GeoJSON.Feature<GeoJSON.MultiPolygon | GeoJSON.Polygon>, i, ''),
		)
	if ('type' in geo && geo.type === 'Topology') return topoToRegions(geo as Topology)
	return []
}

export type GeoMapPreset = 'us-counties' | 'us-states' | 'world'

const topoLoaders: Record<GeoMapPreset, () => Promise<{ default: unknown }>> = {
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

export const loadPresetFeatures = async (preset: GeoMapPreset): Promise<GeoRegion[]> => {
	const mod = await topoLoaders[preset]()
	return topoToRegions(mod.default as Topology, topoObjectNames[preset])
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

export const filterFeatures = (features: readonly GeoRegion[], region: GeoRegionFilter): GeoRegion[] => {
	if (typeof region === 'function') return features.filter(region)
	const usMatch = region.match(/^us-([a-z]{2})$/i)

	if (usMatch) {
		const fips = US_STATE_FIPS[usMatch[1].toUpperCase()]
		if (fips) return features.filter((f) => f.id.startsWith(fips))
	}

	const continentName = CONTINENT_NAMES[region.toLowerCase()]
	if (continentName) return features.filter((f) => f.properties.CONTINENT === continentName)
	return features as GeoRegion[]
}

export const buildPathGenerator = (projection: GeoProjection) => d3Geo.geoPath(projection).digits(2)

export type ProjectionInput = ((width: number, height: number) => GeoProjection) | GeoProjectionPreset | undefined

/**
 * Pan projections fit to features so a filtered region fills the viewport.
 * Rotate projections fit to sphere so rotation can move the visible area freely.
 */
export const fitProjection = ({
	features,
	projection,
	rotation,
	viewBoxW = 1000,
}: {
	features: readonly GeoRegion[]
	projection?: ProjectionInput
	rotation?: [number, number]
	viewBoxW?: number
}) => {
	const presetName = typeof projection === 'string' ? projection : undefined
	const dragBehavior = getDragBehavior(presetName)
	const aspect = getProjectionAspectRatio(projection)
	const viewBoxH = viewBoxW / aspect
	const proj = resolveProjection(projection, viewBoxW, viewBoxH)

	if (rotation && proj.rotate) proj.rotate([rotation[0], rotation[1], 0])

	if (dragBehavior === 'pan' && features.length > 0) {
		const fc: GeoJSON.FeatureCollection = {
			type: 'FeatureCollection',
			features: features.map((f) => ({ type: 'Feature' as const, geometry: f.geometry, properties: {} })),
		}
		proj.fitSize([viewBoxW, viewBoxH], fc)
	}

	return { projection: proj, pathGen: buildPathGenerator(proj), dragBehavior, viewBoxW, viewBoxH }
}

/**
 * Computes a {@link GeoZoomState} that centers a point in the viewport at the given `scale`.
 * Resolves via `point.geometry` (Point or MultiPoint centroid) or `point.properties.regionId` →
 * region centroid. Returns `null` if nothing resolves.
 *
 * Mirrors `getFeatureZoom` for points — a point has no extent to fit, so the caller picks `scale`.
 */
export const getPointZoom = ({
	point,
	regions,
	scale = 4,
}: {
	point: GeoPoint
	regions?: readonly GeoRegion[]
	scale?: number
}): GeoZoomState | null => {
	const center = resolvePointCoord(point, regions)
	if (!center) return null
	return { scale, center }
}

const easeInOutQuad = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

/**
 * Animates a controlled-zoom transition by driving `onUpdate` with interpolated `GeoZoomState`
 * values over `duration`. Returns a cancel function. Runs entirely in userspace — d3-zoom stays
 * out of it. Pair with controlled `zoom`/`onZoomChange` for a "fly to" effect:
 *
 * ```ts
 * animateZoom({ from: zoom, to: getPointZoom({ point: nyc }), onUpdate: setZoom })
 * ```
 */
export const animateZoom = ({
	from,
	to,
	duration = 750,
	onUpdate,
}: {
	from: GeoZoomState | undefined
	to: GeoZoomState
	duration?: number
	onUpdate: (zoom: GeoZoomState) => void
}) => {
	const start: GeoZoomState = from ?? { scale: 1, center: [0, 0] }
	const startTime = performance.now()
	let cancelled = false

	const tick = () => {
		if (cancelled) return
		const t = Math.min((performance.now() - startTime) / duration, 1)
		const k = easeInOutQuad(t)
		onUpdate({
			scale: start.scale + (to.scale - start.scale) * k,
			center: [
				start.center[0] + (to.center[0] - start.center[0]) * k,
				start.center[1] + (to.center[1] - start.center[1]) * k,
			],
		})
		if (t < 1) requestAnimationFrame(tick)
	}

	requestAnimationFrame(tick)

	return () => {
		cancelled = true
	}
}

export const getFeatureZoom = ({
	feature,
	pathGenerator,
	projection,
	width,
	height,
	padding = 0.9,
}: {
	feature: GeoRegion
	pathGenerator: ReturnType<typeof buildPathGenerator>
	projection: GeoProjection
	width: number
	height: number
	/** Fraction of the viewport the feature should fill (0.9 = 5% margin per side). */
	padding?: number
}): GeoZoomState => {
	const [[x0, y0], [x1, y1]] = pathGenerator.bounds(feature.geometry)
	const dx = x1 - x0
	const dy = y1 - y0
	const center = projection.invert?.([(x0 + x1) / 2, (y0 + y1) / 2]) ?? [0, 0]
	return { scale: padding * Math.min(width / dx, height / dy), center: [center[0], center[1]] }
}

export const DEFAULT_CHORO_COLORS = ['var(--color-base-100)', 'var(--color-base-content)']

export type ChoroData = {
	fill: (id: string) => string | undefined
	valueMap: Map<string, number>
	values: number[]
	min: number
	max: number
}

export const getChoroData = ({
	data,
	scaleType = 'quantize',
	steps = 4,
	colors,
	colorSpace,
}: ChoroplethConfig): ChoroData => {
	const valueMap = new Map(data.map((d) => [d.id, d.value]))
	const values = data.map((d) => d.value).sort((a, b) => a - b)
	const min = values[0] ?? 0
	const max = values[values.length - 1] ?? 0
	if (!data.length) return { fill: () => undefined, valueMap, values, min, max }

	const stops = colors?.length ? colors : DEFAULT_CHORO_COLORS
	const span = max - min
	const safeSpan = span || 1
	const safeSteps = Math.max(steps, 1)
	const bucketDiv = Math.max(safeSteps - 1, 1)

	const fill = (id: string) => {
		const val = valueMap.get(id)
		if (val == null) return undefined
		if (!span) return interpolateColors(0.5, stops, colorSpace)

		const t =
			scaleType === 'linear'
				? (val - min) / safeSpan
				: scaleType === 'quantize'
					? Math.min(Math.floor(((val - min) / safeSpan) * safeSteps), safeSteps - 1) / bucketDiv
					: Math.min(Math.floor((R.sortedIndex(values, val) / values.length) * safeSteps), safeSteps - 1) / bucketDiv

		return interpolateColors(t, stops, colorSpace)
	}

	return { fill, valueMap, values, min, max }
}

export const buildLegendItems = (choro: ChoroData, config: ChoroplethConfig): GeoLegendItem[] => {
	const { scaleType = 'quantize', steps = 5, colors, colorSpace, valueFormat } = config
	const { values, min, max } = choro
	if (!values.length) return []

	const stops = colors?.length ? colors : DEFAULT_CHORO_COLORS
	const span = max - min
	const safeSteps = Math.max(steps, 1)
	const fmt = valueFormat ?? ((v: number) => v.toLocaleString())

	if (scaleType === 'linear')
		return [
			{ key: 'min', color: interpolateColors(0, stops, colorSpace), label: fmt(min) },
			{ key: 'max', color: interpolateColors(1, stops, colorSpace), label: fmt(max) },
		]

	const items: GeoLegendItem[] = []

	for (let i = 0; i < safeSteps; i++) {
		const t = safeSteps === 1 ? 0.5 : i / (safeSteps - 1)
		const color = interpolateColors(t, stops, colorSpace)
		let label: string

		if (scaleType === 'quantize') {
			const lo = min + (span / safeSteps) * i
			const hi = min + (span / safeSteps) * (i + 1)
			label = valueFormat
				? `${fmt(lo)}–${fmt(hi)}`
				: i === safeSteps - 1
					? `${fmt(Math.round(lo))}–${fmt(Math.round(hi))}`
					: `${fmt(Math.round(lo))}–${fmt(Math.round(hi - 1))}`
		} else {
			const bucketSize = Math.ceil(values.length / safeSteps)
			const lo = values[Math.min(i * bucketSize, values.length - 1)]
			const hi = values[Math.min((i + 1) * bucketSize - 1, values.length - 1)]
			label = `${fmt(lo)}–${fmt(hi)}`
		}

		items.push({ key: `step-${i}`, color, label })
	}

	return items
}
