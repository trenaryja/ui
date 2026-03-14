import { BarChart } from '@/components'
import type { DemoMeta, Density } from '@demo'
import { ChartCard, randChartData } from '@demo'
import { useState } from 'react'

export const meta: DemoMeta = { title: 'BarChart', category: 'components', tags: ['chart'] }

const counts: Record<Density, number> = { Low: 7, Med: 30, High: 365 }
const rand = (d: Density) => randChartData(counts[d])

export function Demo() {
	const [single, setSingle] = useState(() => rand('Low'))
	const [multi, setMulti] = useState(() => rand('Low'))
	const [stacked, setStacked] = useState(() => rand('Low'))
	const [horizontal, setHorizontal] = useState(() => rand('Low'))
	const [dates, setDates] = useState(() => rand('Low'))
	const [sparse, setSparse] = useState(() => randChartData(counts.Low, { sparse: true }))
	const [brush, setBrush] = useState(() => rand('Low'))
	const [synced1, setSynced1] = useState(() => rand('Low'))
	const [synced2, setSynced2] = useState(() => rand('Low'))
	const [refLine, setRefLine] = useState(() => rand('Low'))

	return (
		<div className='demo'>
			<ChartCard title='Default' onRandomize={(d) => setSingle(rand(d))}>
				{(key) => <BarChart key={key} data={single.data} xKey='label' yKey='a' />}
			</ChartCard>

			<ChartCard title='Multi-series' onRandomize={(d) => setMulti(rand(d))}>
				{(key) => <BarChart key={key} data={multi.data} xKey='label' series={multi.series} legend />}
			</ChartCard>

			<ChartCard title='Stacked' onRandomize={(d) => setStacked(rand(d))}>
				{(key) => <BarChart key={key} data={stacked.data} xKey='label' series={stacked.series} stacked legend />}
			</ChartCard>

			<ChartCard title='Horizontal' onRandomize={(d) => setHorizontal(rand(d))}>
				{(key) => <BarChart key={key} data={horizontal.data} xKey='label' yKey='a' layout='vertical' />}
			</ChartCard>

			<ChartCard title='Date x-axis' onRandomize={(d) => setDates(rand(d))}>
				{(key) => <BarChart key={key} data={dates.data} xKey='date' yKey='a' xType='date' />}
			</ChartCard>

			<ChartCard title='Sparse dates' onRandomize={(d) => setSparse(randChartData(counts[d], { sparse: true }))}>
				{(key) => <BarChart key={key} data={sparse.data} xKey='date' yKey='a' xType='date' />}
			</ChartCard>

			<ChartCard title='With brush' onRandomize={(d) => setBrush(rand(d))}>
				{(key) => (
					<BarChart key={key} data={brush.data} xKey='label' yKey='a' brush brushOptions={{ lockYAxis: true }} />
				)}
			</ChartCard>

			<ChartCard
				title='Synced charts'
				onRandomize={(d) => {
					setSynced1(rand(d))
					setSynced2(rand(d))
				}}
			>
				{(key) => (
					<div className='grid gap-2 md:grid-cols-2'>
						<BarChart key={`a-${key}`} data={synced1.data} xKey='label' yKey='a' syncId='demo' />
						<BarChart key={`b-${key}`} data={synced2.data} xKey='label' yKey='a' syncId='demo' />
					</div>
				)}
			</ChartCard>

			<ChartCard title='With reference line' onRandomize={(d) => setRefLine(rand(d))}>
				{(key) => (
					<BarChart key={key} data={refLine.data} xKey='label' yKey='a' referenceLines={[{ y: 50, label: 'Target' }]} />
				)}
			</ChartCard>
		</div>
	)
}
