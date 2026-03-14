'use client'

import type { ChoroplethDatum, ChoroplethScaleType, GeoMapProps, GeoMapVariant } from '@/components'
import { Button, Field, Fieldset, GeoMap, Select, Toggle } from '@/components'
import type { SvgGeoMapLocation, SvgGeoMapName } from '@/data/svg-geo-maps'
import { svgGeoMaps } from '@/data/svg-geo-maps'
import type { DemoMeta } from '@demo'
import { faker } from '@faker-js/faker'
import { useState } from 'react'

export const meta: DemoMeta = { title: 'GeoMap', category: 'components' }

const COLOR_PRESETS: Record<string, string[] | undefined> = {
	default: undefined,
	primary: ['var(--color-base-100)', 'var(--color-primary)'],
	heat: ['var(--color-amber-300)', 'var(--color-orange-500)', 'var(--color-red-700)'],
	cool: ['var(--color-sky-200)', 'var(--color-blue-500)', 'var(--color-indigo-800)'],
	diverging: ['var(--color-error)', 'transparent', 'var(--color-success)'],
}

const randChoroplethData = (map: SvgGeoMapName): ChoroplethDatum[] => {
	const raw = svgGeoMaps[map].locations.map(() => faker.number.float({ min: 0, max: 1 }))
	const min = Math.min(...raw)
	const max = Math.max(...raw)
	const span = max - min || 1
	return svgGeoMaps[map].locations.map((l, i) => ({
		id: l.id,
		value: Math.round(((raw[i] - min) / span) * 100) / 100,
	}))
}

export function Demo() {
	const [map, setMap] = useState<SvgGeoMapName>('usa')
	const [variant, setVariant] = useState<GeoMapVariant>('default')
	const [scaleType, setScaleType] = useState<ChoroplethScaleType>('quantize')
	const [showChoropleth, setShowChoropleth] = useState(true)
	const [showTooltip, setShowTooltip] = useState(true)
	const [showLegend, setShowLegend] = useState(true)
	const [choroplethData, setChoroplethData] = useState(() => randChoroplethData(map))
	const [selected, setSelected] = useState<SvgGeoMapLocation['id'][]>([])
	const [singleSelected, setSingleSelected] = useState<SvgGeoMapLocation['id'] | null>(null)
	const [colorPreset, setColorPreset] = useState<string>('default')
	const [steps, setSteps] = useState(4)

	const randomize = () => setChoroplethData(randChoroplethData(map))

	const fmtPct = (v: number) => `${(v * 100).toFixed(0)}%`

	const choropleth = showChoropleth
		? { data: choroplethData, scaleType, steps, colors: COLOR_PRESETS[colorPreset], valueFormat: fmtPct }
		: undefined

	const formatters = { tooltip: { value: (v: number) => fmtPct(v) } }

	const sharedProps = {
		map,
		choropleth,
		formatters,
		components: { tooltip: showTooltip, legend: showLegend },
	}

	const geoMapProps: GeoMapProps =
		variant === 'multi-select'
			? { ...sharedProps, variant, value: selected, onChange: setSelected }
			: variant === 'single-select'
				? { ...sharedProps, variant, value: singleSelected, onChange: setSingleSelected }
				: sharedProps

	return (
		<div className='flex flex-col gap-4'>
			<Fieldset className='flex flex-col items-center gap-2'>
				<div className='flex flex-wrap gap-x-4 gap-y-2'>
					<Field label='Map'>
						<Select
							className='select-sm'
							value={map}
							onChange={(e) => {
								setMap(e.target.value as SvgGeoMapName)
								setChoroplethData(randChoroplethData(e.target.value as SvgGeoMapName))
								setSelected([])
								setSingleSelected(null)
							}}
						>
							<option value='usa'>USA</option>
							<option value='world'>World</option>
						</Select>
					</Field>
					<Field label='Variant'>
						<Select
							className='select-sm'
							value={variant}
							onChange={(e) => {
								setVariant(e.target.value as GeoMapVariant)
								setSelected([])
								setSingleSelected(null)
							}}
						>
							<option value='default'>Default</option>
							<option value='multi-select'>Multi Select</option>
							<option value='single-select'>Single Select</option>
						</Select>
					</Field>
					<Field label='Colors'>
						<Select className='select-sm' value={colorPreset} onChange={(e) => setColorPreset(e.target.value)}>
							{Object.keys(COLOR_PRESETS).map((key) => (
								<option key={key} value={key}>
									{key[0].toUpperCase() + key.slice(1)}
								</option>
							))}
						</Select>
					</Field>
					<Field label='Scale'>
						<Select
							className='select-sm'
							value={scaleType}
							onChange={(e) => setScaleType(e.target.value as ChoroplethScaleType)}
						>
							<option value='quantize'>Quantize</option>
							<option value='quantile'>Quantile</option>
							<option value='linear'>Linear</option>
						</Select>
					</Field>
					{scaleType !== 'linear' && (
						<Field label='Steps'>
							<Select className='select-sm' value={steps} onChange={(e) => setSteps(Number(e.target.value))}>
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
						<Toggle checked={showChoropleth} onChange={(e) => setShowChoropleth(e.target.checked)} />
					</Field>
					<Field label='Tooltip' labelPlacement='right-center'>
						<Toggle checked={showTooltip} onChange={(e) => setShowTooltip(e.target.checked)} />
					</Field>
					<Field label='Legend' labelPlacement='right-center'>
						<Toggle checked={showLegend} onChange={(e) => setShowLegend(e.target.checked)} />
					</Field>
					<Button className='btn-sm' onClick={randomize}>
						Randomize
					</Button>
				</div>
			</Fieldset>

			<GeoMap {...geoMapProps} />

			{variant === 'multi-select' && selected.length > 0 && (
				<div className='text-sm opacity-75'>Selected: {selected.join(', ')}</div>
			)}
			{variant === 'single-select' && singleSelected && (
				<div className='text-sm opacity-75'>Selected: {singleSelected}</div>
			)}
		</div>
	)
}
