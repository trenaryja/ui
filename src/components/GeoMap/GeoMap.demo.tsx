'use client'

import { GeoMap } from '@/components'
import type { ChoroplethDatum, ChoroplethScaleType, GeoMapVariant, GeoRegionState } from '@/components'
import { svgGeoMaps, type SvgGeoMapLocation, type SvgGeoMapName } from '@/data/svg-geo-maps'
import type { DemoMeta } from '@demo'
import { faker } from '@faker-js/faker'
import { useState } from 'react'

export const meta: DemoMeta = { title: 'GeoMap', category: 'components' }

const randChoroplethData = (map: SvgGeoMapName): ChoroplethDatum[] =>
	svgGeoMaps[map].locations.map((l) => ({
		id: l.id,
		value: faker.helpers.maybe(() => faker.number.int({ min: 0, max: 10_000 }), { probability: 0.7 }) ?? 0,
	}))

export function Demo() {
	const [map, setMap] = useState<SvgGeoMapName>('usa')
	const [variant, setVariant] = useState<GeoMapVariant>('static')
	const [scaleType, setScaleType] = useState<ChoroplethScaleType>('quantize')
	const [showChoropleth, setShowChoropleth] = useState(true)
	const [showTooltip, setShowTooltip] = useState(true)
	const [showLegend, setShowLegend] = useState(true)
	const [choroplethData, setChoroplethData] = useState(() => randChoroplethData(map))
	const [selected, setSelected] = useState<SvgGeoMapLocation['id'][]>([])
	const [singleSelected, setSingleSelected] = useState<SvgGeoMapLocation['id'] | null>(null)

	const randomize = () => setChoroplethData(randChoroplethData(map))

	const choropleth = showChoropleth
		? {
				data: choroplethData,
				scaleType,
				legend: showLegend ? { placement: 'bottom-end' as const } : undefined,
			}
		: undefined

	return (
		<div className='flex flex-col gap-4'>
			<div className='flex flex-wrap gap-2 items-center'>
				<select className='select select-sm' value={map} onChange={(e) => { setMap(e.target.value as SvgGeoMapName); setChoroplethData(randChoroplethData(e.target.value as SvgGeoMapName)); setSelected([]); setSingleSelected(null) }}>
					<option value='usa'>USA</option>
					<option value='world'>World</option>
				</select>
				<select className='select select-sm' value={variant} onChange={(e) => { setVariant(e.target.value as GeoMapVariant); setSelected([]); setSingleSelected(null) }}>
					<option value='static'>Static</option>
					<option value='multi-select'>Multi Select</option>
					<option value='single-select'>Single Select</option>
				</select>
				<select className='select select-sm' value={scaleType} onChange={(e) => setScaleType(e.target.value as ChoroplethScaleType)}>
					<option value='quantize'>Quantize</option>
					<option value='quantile'>Quantile</option>
					<option value='linear'>Linear</option>
				</select>
				<label className='label cursor-pointer gap-1'>
					<input type='checkbox' className='toggle toggle-sm' checked={showChoropleth} onChange={(e) => setShowChoropleth(e.target.checked)} />
					Choropleth
				</label>
				<label className='label cursor-pointer gap-1'>
					<input type='checkbox' className='toggle toggle-sm' checked={showTooltip} onChange={(e) => setShowTooltip(e.target.checked)} />
					Tooltip
				</label>
				<label className='label cursor-pointer gap-1'>
					<input type='checkbox' className='toggle toggle-sm' checked={showLegend} onChange={(e) => setShowLegend(e.target.checked)} />
					Legend
				</label>
				<button className='btn btn-sm' onClick={randomize}>Randomize</button>
			</div>

			<div className='max-w-3xl'>
				{variant === 'static' && (
					<GeoMap
						map={map}
						choropleth={choropleth}
						renderTooltip={showTooltip}
					/>
				)}
				{variant === 'multi-select' && (
					<GeoMap
						variant='multi-select'
						map={map}
						choropleth={choropleth}
						renderTooltip={showTooltip}
						value={selected}
						onChange={setSelected}
					/>
				)}
				{variant === 'single-select' && (
					<GeoMap
						variant='single-select'
						map={map}
						choropleth={choropleth}
						renderTooltip={showTooltip}
						value={singleSelected}
						onChange={setSingleSelected}
					/>
				)}
			</div>

			{variant === 'multi-select' && selected.length > 0 && (
				<div className='text-sm opacity-75'>Selected: {selected.join(', ')}</div>
			)}
			{variant === 'single-select' && singleSelected && (
				<div className='text-sm opacity-75'>Selected: {singleSelected}</div>
			)}
		</div>
	)
}
