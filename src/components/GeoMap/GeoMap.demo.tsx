'use client'

import type { ChoroplethDatum, ChoroplethScaleType, GeoMapProps } from '@/components'
import { Button, Field, GeoMap, Select, toast, Toggle } from '@/components'
import { formatPercent } from '@/utils'
import type { DemoMeta } from '@demo'
import { faker } from '@faker-js/faker'
import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import * as R from 'remeda'
import type { GeoPoint, GeoProjectionPreset, GeoZoomState } from './GeoMap.types'
import type { GeoMapPreset } from './GeoMap.utils'
import { animateZoom, getPointZoom, getProjectionsByTag, loadPresetFeatures } from './GeoMap.utils'

type PointDensity = 'high' | 'low' | 'medium'

const POPULATED_PLACES_URLS: Record<PointDensity, string> = {
	low: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_populated_places_simple.geojson',
	medium:
		'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_50m_populated_places.geojson',
	high: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_populated_places.geojson',
}

const POINT_DENSITY_OPTIONS: { value: PointDensity; label: string }[] = [
	{ value: 'low', label: 'Low (~240)' },
	{ value: 'medium', label: 'Medium (~1.2k)' },
	{ value: 'high', label: 'High (~7.3k)' },
]

const rawFeaturesCache = new Map<PointDensity, GeoJSON.Feature<GeoJSON.Point>[]>()
const placesCache = new Map<string, readonly GeoPoint[]>()

const toGeoPoint = (f: GeoJSON.Feature<GeoJSON.Point>, i: number): GeoPoint => {
	const props = (f.properties ?? {}) as Record<string, unknown>
	const name = (props.NAME ?? props.name ?? props.NAMEASCII ?? 'Unknown') as string
	return { type: 'Feature', id: `place-${i}`, name, geometry: f.geometry, properties: {} }
}

const fetchPopulatedPlaces = async (density: PointDensity, countryCode?: string): Promise<readonly GeoPoint[]> => {
	const cacheKey = `${density}:${countryCode ?? ''}`
	const cached = placesCache.get(cacheKey)
	if (cached) return cached

	let features = rawFeaturesCache.get(density)

	if (!features) {
		const res = await fetch(POPULATED_PLACES_URLS[density])
		if (!res.ok) throw new Error(`Failed to fetch populated places: ${res.status}`)
		const collection = (await res.json()) as GeoJSON.FeatureCollection<GeoJSON.Point>
		// eslint-disable-next-line prefer-destructuring -- reassigning an existing variable; assignment destructuring `({ features } = collection)` is harder to read
		features = collection.features
		rawFeaturesCache.set(density, features)
	}

	const filtered = countryCode
		? features.filter((f) => {
				const props = (f.properties ?? {}) as Record<string, unknown>
				return (props.ADM0_A3 ?? props.adm0_a3) === countryCode
			})
		: features

	const points = filtered.map(toGeoPoint)
	placesCache.set(cacheKey, points)
	return points
}

const usePopulatedPlaces = (density: PointDensity, countryCode?: string): readonly GeoPoint[] => {
	const cacheKey = `${density}:${countryCode ?? ''}`
	const [points, setPoints] = useState<readonly GeoPoint[]>(() => placesCache.get(cacheKey) ?? [])
	useEffect(() => {
		let cancelled = false
		fetchPopulatedPlaces(density, countryCode).then((pts) => {
			if (!cancelled) setPoints(pts)
		})

		return () => {
			cancelled = true
		}
	}, [density, countryCode])
	return points
}

const US_PRESETS = new Set<GeoMapPreset>(['us-counties', 'us-states'])

export const meta: DemoMeta = { title: 'GeoMap', category: 'components' }

const COLOR_PRESETS: Record<string, string[] | undefined> = {
	default: undefined,
	primary: ['var(--color-base-100)', 'var(--color-primary)'],
	heat: ['var(--color-amber-300)', 'var(--color-orange-500)', 'var(--color-red-700)'],
	cool: ['var(--color-sky-200)', 'var(--color-blue-500)', 'var(--color-indigo-800)'],
	diverging: ['var(--color-error)', 'transparent', 'var(--color-success)'],
}

const MAP_PRESETS: { value: GeoMapPreset; label: string }[] = [
	{ value: 'world', label: 'World' },
	{ value: 'us-states', label: 'US States' },
	{ value: 'us-counties', label: 'US Counties' },
]

const projectionsByTag = getProjectionsByTag()

const fmtPct = (v: number) => formatPercent(v, { decimals: 0 })

const randChoroplethData = (ids: readonly string[]): ChoroplethDatum[] => {
	const raw = ids.map(() => faker.number.float({ min: 0, max: 1 }))
	const min = Math.min(...raw)
	const max = Math.max(...raw)
	const span = max - min || 1
	return ids.map((id, i) => ({ id, value: Math.round(((raw[i] - min) / span) * 100) / 100 }))
}

const useFeatureIds = (geo: GeoMapPreset): readonly string[] => {
	const [ids, setIds] = useState<readonly string[]>([])
	useEffect(() => {
		let cancelled = false
		loadPresetFeatures(geo).then((features) => {
			if (!cancelled) setIds(features.map((f) => f.id))
		})

		return () => {
			cancelled = true
		}
	}, [geo])
	return ids
}

type SelectionMode = '' | 'multi' | 'single'

type DemoState = {
	mapPreset: GeoMapPreset
	projectionPreset: '' | GeoProjectionPreset
	regionSelection: SelectionMode
	pointSelection: SelectionMode
	colorPreset: string
	scaleType: ChoroplethScaleType
	steps: number
	showChoropleth: boolean
	showTooltip: boolean
	showLegend: boolean
	showGraticule: boolean
	showZoom: boolean
	showDraggable: boolean
	showPoints: boolean
	pointDensity: PointDensity
	cluster: boolean
	clusterRadius: number
}

const SELECTION_OPTIONS: { value: SelectionMode; label: string }[] = [
	{ value: '', label: 'None' },
	{ value: 'single', label: 'Single' },
	{ value: 'multi', label: 'Multi' },
]

type SetFn = <TKey extends keyof DemoState>(key: TKey, value: DemoState[TKey]) => void

const Section = ({ title, defaultOpen, children }: { title: string; defaultOpen?: boolean; children: ReactNode }) => (
	<div className='collapse collapse-horizontal join-item'>
		<input type='radio' name='geomap-controls' defaultChecked={defaultOpen} />
		<div className='collapse-title surface font-semibold'>{title}</div>
		<div className='collapse-content'>
			<div className='flex flex-wrap items-center justify-center gap-x-4 gap-y-2 p-4'>{children}</div>
		</div>
	</div>
)

const MapSection = ({ s, set, onResetRegions }: { s: DemoState; set: SetFn; onResetRegions: () => void }) => (
	<Section title='Map' defaultOpen>
		<Field label='Preset'>
			<Select
				className='select-sm'
				value={s.mapPreset}
				onChange={(e) => {
					set('mapPreset', e.target.value as GeoMapPreset)
					onResetRegions()
				}}
			>
				{MAP_PRESETS.map((p) => (
					<option key={p.value} value={p.value}>
						{p.label}
					</option>
				))}
			</Select>
		</Field>
		<Field label='Projection'>
			<Select
				className='select-sm'
				value={s.projectionPreset}
				onChange={(e) => set('projectionPreset', e.target.value as '' | GeoProjectionPreset)}
			>
				<option value=''>Auto</option>
				{R.entries(projectionsByTag).map(([tag, presets]) => (
					<optgroup key={tag} label={tag}>
						{presets.map((p) => (
							<option key={p} value={p}>
								{p}
							</option>
						))}
					</optgroup>
				))}
			</Select>
		</Field>
		<Field label='Selection'>
			<Select
				className='select-sm'
				value={s.regionSelection}
				onChange={(e) => {
					set('regionSelection', e.target.value as SelectionMode)
					onResetRegions()
				}}
			>
				{SELECTION_OPTIONS.map((o) => (
					<option key={o.value} value={o.value}>
						{o.label}
					</option>
				))}
			</Select>
		</Field>
		<Field label='Graticule' labelPlacement='right-center'>
			<Toggle checked={s.showGraticule} onChange={(e) => set('showGraticule', e.target.checked)} />
		</Field>
		<Field label='Zoomable' labelPlacement='right-center'>
			<Toggle checked={s.showZoom} onChange={(e) => set('showZoom', e.target.checked)} />
		</Field>
		<Field label='Draggable' labelPlacement='right-center'>
			<Toggle checked={s.showDraggable} onChange={(e) => set('showDraggable', e.target.checked)} />
		</Field>
		<Field label='Tooltip' labelPlacement='right-center'>
			<Toggle checked={s.showTooltip} onChange={(e) => set('showTooltip', e.target.checked)} />
		</Field>
	</Section>
)

const ChoroplethSection = ({ s, set, onRandomize }: { s: DemoState; set: SetFn; onRandomize: () => void }) => (
	<Section title='Choropleth'>
		<Field label='Show' labelPlacement='right-center'>
			<Toggle checked={s.showChoropleth} onChange={(e) => set('showChoropleth', e.target.checked)} />
		</Field>
		<Field label='Colors'>
			<Select className='select-sm' value={s.colorPreset} onChange={(e) => set('colorPreset', e.target.value)}>
				{Object.keys(COLOR_PRESETS).map((k) => (
					<option key={k} value={k}>
						{k[0].toUpperCase() + k.slice(1)}
					</option>
				))}
			</Select>
		</Field>
		<Field label='Scale'>
			<Select
				className='select-sm'
				value={s.scaleType}
				onChange={(e) => set('scaleType', e.target.value as ChoroplethScaleType)}
			>
				<option value='quantize'>Quantize</option>
				<option value='quantile'>Quantile</option>
				<option value='linear'>Linear</option>
			</Select>
		</Field>
		{s.scaleType !== 'linear' && (
			<Field label='Steps'>
				<Select className='select-sm' value={s.steps} onChange={(e) => set('steps', Number(e.target.value))}>
					{[2, 3, 4, 5, 6, 7, 8].map((n) => (
						<option key={n} value={n}>
							{n}
						</option>
					))}
				</Select>
			</Field>
		)}
		<Field label='Legend' labelPlacement='right-center'>
			<Toggle checked={s.showLegend} onChange={(e) => set('showLegend', e.target.checked)} />
		</Field>
		<Button className='btn-sm' onClick={onRandomize}>
			Randomize
		</Button>
	</Section>
)

const PointsSection = ({
	s,
	set,
	onResetPoints,
	onFlyToRandomCity,
}: {
	s: DemoState
	set: SetFn
	onResetPoints: () => void
	onFlyToRandomCity: () => void
}) => (
	<Section title='Points'>
		<Field label='Show' labelPlacement='right-center'>
			<Toggle checked={s.showPoints} onChange={(e) => set('showPoints', e.target.checked)} />
		</Field>
		<Field label='Density'>
			<Select
				className='select-sm'
				value={s.pointDensity}
				onChange={(e) => {
					set('pointDensity', e.target.value as PointDensity)
					onResetPoints()
				}}
			>
				{POINT_DENSITY_OPTIONS.map((o) => (
					<option key={o.value} value={o.value}>
						{o.label}
					</option>
				))}
			</Select>
		</Field>
		<Field label='Selection'>
			<Select
				className='select-sm'
				value={s.pointSelection}
				onChange={(e) => {
					set('pointSelection', e.target.value as SelectionMode)
					onResetPoints()
				}}
			>
				{SELECTION_OPTIONS.map((o) => (
					<option key={o.value} value={o.value}>
						{o.label}
					</option>
				))}
			</Select>
		</Field>
		<Field label='Cluster' labelPlacement='right-center'>
			<Toggle checked={s.cluster} onChange={(e) => set('cluster', e.target.checked)} />
		</Field>
		{s.cluster && (
			<Field label='Radius'>
				<Select
					className='select-sm'
					value={s.clusterRadius}
					onChange={(e) => set('clusterRadius', Number(e.target.value))}
				>
					{[20, 40, 60, 80, 100, 120].map((n) => (
						<option key={n} value={n}>
							{n}px
						</option>
					))}
				</Select>
			</Field>
		)}
		{s.showPoints && (
			<Button className='btn-sm' onClick={onFlyToRandomCity}>
				Fly to random city
			</Button>
		)}
	</Section>
)

const MapControls = ({
	s,
	set,
	onResetRegions,
	onResetPoints,
	onRandomize,
	onFlyToRandomCity,
}: {
	s: DemoState
	set: SetFn
	onResetRegions: () => void
	onResetPoints: () => void
	onRandomize: () => void
	onFlyToRandomCity: () => void
}) => (
	<div className='join join-horizontal w-full'>
		<MapSection s={s} set={set} onResetRegions={onResetRegions} />
		<ChoroplethSection s={s} set={set} onRandomize={onRandomize} />
		<PointsSection s={s} set={set} onResetPoints={onResetPoints} onFlyToRandomCity={onFlyToRandomCity} />
	</div>
)

export function Demo() {
	const [s, setS] = useState<DemoState>({
		mapPreset: 'world',
		projectionPreset: '',
		regionSelection: '',
		pointSelection: '',
		colorPreset: 'default',
		scaleType: 'quantize',
		steps: 4,
		showChoropleth: true,
		showTooltip: true,
		showLegend: true,
		showGraticule: false,
		showZoom: true,
		showDraggable: true,
		showPoints: true,
		pointDensity: 'low',
		cluster: false,
		clusterRadius: 40,
	})
	const [selected, setSelected] = useState<string[]>([])
	const [singleSelected, setSingleSelected] = useState<string | null>(null)
	const [selectedPoints, setSelectedPoints] = useState<string[]>([])
	const [singleSelectedPoint, setSingleSelectedPoint] = useState<string | null>(null)
	const [zoom, setZoom] = useState<GeoZoomState | undefined>(undefined)
	const [randomSeed, setRandomSeed] = useState(0)

	const set = <TKey extends keyof DemoState>(key: TKey, value: DemoState[TKey]) =>
		setS((prev) => ({ ...prev, [key]: value }))

	const featureIds = useFeatureIds(s.mapPreset)
	const cityPoints = usePopulatedPlaces(s.pointDensity, US_PRESETS.has(s.mapPreset) ? 'USA' : undefined)
	const choroplethData = useMemo(() => randChoroplethData(featureIds), [featureIds, randomSeed])

	const choropleth = s.showChoropleth
		? {
				data: choroplethData,
				scaleType: s.scaleType,
				steps: s.steps,
				colors: COLOR_PRESETS[s.colorPreset],
				valueFormat: fmtPct,
			}
		: undefined

	const sharedProps = {
		geo: s.mapPreset,
		projection: s.projectionPreset || undefined,
		choropleth,
		points: s.showPoints
			? { data: cityPoints, cluster: s.cluster ? { radius: s.clusterRadius } : undefined }
			: undefined,
		formatters: { tooltip: { value: (v: number) => fmtPct(v) } },
		draggable: s.showDraggable,
		zoomable: s.showZoom,
		components: { tooltip: s.showTooltip, legend: s.showLegend, graticule: s.showGraticule, zoom: s.showZoom },
		classNames: {
			zoom: 'absolute right-1 bottom-1',
		},
	} satisfies GeoMapProps

	const resetRegions = () => {
		setSelected([])
		setSingleSelected(null)
	}

	const resetPoints = () => {
		setSelectedPoints([])
		setSingleSelectedPoint(null)
	}

	const regionFormInput =
		s.regionSelection === 'multi'
			? { mode: 'multi' as const, value: selected, onChange: setSelected }
			: s.regionSelection === 'single'
				? { mode: 'single' as const, value: singleSelected, onChange: setSingleSelected }
				: undefined

	const pointFormInput =
		s.pointSelection === 'multi'
			? { mode: 'multi' as const, value: selectedPoints, onChange: setSelectedPoints }
			: s.pointSelection === 'single'
				? { mode: 'single' as const, value: singleSelectedPoint, onChange: setSingleSelectedPoint }
				: undefined

	const geoMapProps: GeoMapProps = {
		...sharedProps,
		regionFormInput,
		pointFormInput,
		zoom,
		onZoomChange: setZoom,
		classNames: {
			...sharedProps.classNames,
			point: (state) => (state.isSelected ? 'fill-accent! stroke-accent-content!' : undefined),
		},
	}

	const flyToRandomCity = () => {
		if (cityPoints.length === 0) return
		const pick = cityPoints[Math.floor(Math.random() * cityPoints.length)]
		const target = getPointZoom({ point: pick, scale: 6 })
		if (!target) return
		animateZoom({ from: zoom, to: target, onUpdate: setZoom })
		toast(`Flying to ${pick.name}`)
	}

	return (
		<div className='grid size-full max-h-[calc(100vh-4rem)] place-items-center grid-rows-[auto_1fr] gap-4 p-4 full-bleed'>
			<MapControls
				s={s}
				set={set}
				onResetRegions={resetRegions}
				onResetPoints={resetPoints}
				onRandomize={() => setRandomSeed((x) => x + 1)}
				onFlyToRandomCity={flyToRandomCity}
			/>
			<GeoMap {...geoMapProps} />
		</div>
	)
}
