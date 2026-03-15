'use client'

import type { ChoroplethDatum, ChoroplethScaleType, GeoMapProps, GeoMapVariant } from '@/components'
import { Button, Field, Fieldset, GeoMap, Select, Toggle } from '@/components'
import type { GeoMapPreset } from './GeoMap.geo'
import { filterFeatures, resolveGeoPreset } from './GeoMap.geo'
import { geoProjectionPresets } from './GeoMap.types'
import type { GeoProjectionPreset } from './GeoMap.types'
import type { DemoMeta } from '@demo'
import { faker } from '@faker-js/faker'
import { useMemo, useState } from 'react'

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

const REGION_PRESETS: { value: string; label: string }[] = [
	{ value: '', label: 'All' },
	{ value: 'europe', label: 'Europe' },
	{ value: 'north-america', label: 'North America' },
	{ value: 'south-america', label: 'South America' },
	{ value: 'africa', label: 'Africa' },
	{ value: 'asia', label: 'Asia' },
	{ value: 'oceania', label: 'Oceania' },
	{ value: 'US-TX', label: 'Texas (counties)' },
	{ value: 'US-CA', label: 'California (counties)' },
	{ value: 'US-NY', label: 'New York (counties)' },
]

const randChoroplethData = (ids: readonly string[]): ChoroplethDatum[] => {
	const raw = ids.map(() => faker.number.float({ min: 0, max: 1 }))
	const min = Math.min(...raw)
	const max = Math.max(...raw)
	const span = max - min || 1
	return ids.map((id, i) => ({ id, value: Math.round(((raw[i] - min) / span) * 100) / 100 }))
}

const getFeatureIds = (geo: GeoMapPreset, region: string): readonly string[] => {
	const features = resolveGeoPreset(geo)
	const filtered = region ? filterFeatures(features, region) : features
	return filtered.map((f) => f.id)
}

const fmtPct = (v: number) => `${(v * 100).toFixed(0)}%`

type DemoState = {
	mapPreset: GeoMapPreset
	projectionPreset: '' | GeoProjectionPreset
	regionFilter: string
	variant: GeoMapVariant
	colorPreset: string
	scaleType: ChoroplethScaleType
	steps: number
	showChoropleth: boolean
	showTooltip: boolean
	showLegend: boolean
}

const MapControls = ({
	s,
	set,
	onReset,
	onRandomize,
}: {
	s: DemoState
	set: <TKey extends keyof DemoState>(key: TKey, value: DemoState[TKey]) => void
	onReset: () => void
	onRandomize: () => void
}) => (
	<Fieldset className='flex flex-col items-center gap-2'>
		<div className='flex flex-wrap gap-x-4 gap-y-2'>
			<Field label='Map'>
				<Select
					className='select-sm'
					value={s.mapPreset}
					onChange={(e) => {
						set('mapPreset', e.target.value as GeoMapPreset)
						set('regionFilter', '')
						onReset()
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
					{geoProjectionPresets.map((p) => (
						<option key={p} value={p}>
							{p}
						</option>
					))}
				</Select>
			</Field>
			<Field label='Region'>
				<Select
					className='select-sm'
					value={s.regionFilter}
					onChange={(e) => {
						set('regionFilter', e.target.value)
						onReset()
					}}
				>
					{REGION_PRESETS.map((r) => (
						<option key={r.value} value={r.value}>
							{r.label}
						</option>
					))}
				</Select>
			</Field>
			<Field label='Variant'>
				<Select
					className='select-sm'
					value={s.variant}
					onChange={(e) => {
						set('variant', e.target.value as GeoMapVariant)
						onReset()
					}}
				>
					<option value='default'>Default</option>
					<option value='multi-select'>Multi Select</option>
					<option value='single-select'>Single Select</option>
				</Select>
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
		</div>
		<div className='flex flex-wrap items-center gap-x-4 gap-y-2'>
			<Field label='Choropleth' labelPlacement='right-center'>
				<Toggle checked={s.showChoropleth} onChange={(e) => set('showChoropleth', e.target.checked)} />
			</Field>
			<Field label='Tooltip' labelPlacement='right-center'>
				<Toggle checked={s.showTooltip} onChange={(e) => set('showTooltip', e.target.checked)} />
			</Field>
			<Field label='Legend' labelPlacement='right-center'>
				<Toggle checked={s.showLegend} onChange={(e) => set('showLegend', e.target.checked)} />
			</Field>
			<Button className='btn-sm' onClick={onRandomize}>
				Randomize
			</Button>
		</div>
	</Fieldset>
)

export function Demo() {
	const [s, setS] = useState<DemoState>({
		mapPreset: 'world',
		projectionPreset: '',
		regionFilter: '',
		variant: 'default',
		colorPreset: 'default',
		scaleType: 'quantize',
		steps: 4,
		showChoropleth: true,
		showTooltip: true,
		showLegend: true,
	})
	const [selected, setSelected] = useState<string[]>([])
	const [singleSelected, setSingleSelected] = useState<string | null>(null)
	const [randomSeed, setRandomSeed] = useState(0)

	const set = <TKey extends keyof DemoState>(key: TKey, value: DemoState[TKey]) =>
		setS((prev) => ({ ...prev, [key]: value }))

	const isUsRegion = s.regionFilter.startsWith('US-')
	const effectiveGeo = isUsRegion ? ('us-counties' as GeoMapPreset) : s.mapPreset

	const featureIds = useMemo(() => getFeatureIds(effectiveGeo, s.regionFilter), [effectiveGeo, s.regionFilter])
	// eslint-disable-next-line react-hooks/exhaustive-deps
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
		geo: effectiveGeo,
		projection: s.projectionPreset || undefined,
		region: s.regionFilter || undefined,
		choropleth,
		formatters: { tooltip: { value: (v: number) => fmtPct(v) } },
		components: { tooltip: s.showTooltip, legend: s.showLegend },
	}

	const resetSelection = () => {
		setSelected([])
		setSingleSelected(null)
	}

	const geoMapProps: GeoMapProps =
		s.variant === 'multi-select'
			? { ...sharedProps, variant: s.variant, value: selected, onChange: setSelected }
			: s.variant === 'single-select'
				? { ...sharedProps, variant: s.variant, value: singleSelected, onChange: setSingleSelected }
				: sharedProps

	return (
		<div className='flex flex-col gap-4'>
			<MapControls s={s} set={set} onReset={resetSelection} onRandomize={() => setRandomSeed((x) => x + 1)} />
			<GeoMap {...geoMapProps} />
			{s.variant === 'multi-select' && selected.length > 0 && (
				<div className='text-sm opacity-75'>Selected: {selected.join(', ')}</div>
			)}
			{s.variant === 'single-select' && singleSelected && (
				<div className='text-sm opacity-75'>Selected: {singleSelected}</div>
			)}
		</div>
	)
}
