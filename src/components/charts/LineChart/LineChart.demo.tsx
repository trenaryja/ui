import { LineChart } from '@/components'
import type { DemoMeta, Density } from '@demo'
import { ChartCard, randChartData } from '@demo'
import { useState } from 'react'

export const meta: DemoMeta = { title: 'LineChart', category: 'components', tags: ['chart'] }

const counts: Record<Density, number> = { Low: 7, Med: 30, High: 365 }
const rand = (d: Density) => randChartData(counts[d])

export function Demo() {
	const [single, setSingle] = useState(() => rand('Low'))
	const [gradient, setGradient] = useState(() => rand('Low'))
	const [multi, setMulti] = useState(() => rand('Low'))
	const [multiFill, setMultiFill] = useState(() => rand('Low'))
	const [stacked, setStacked] = useState(() => rand('Low'))
	const [dates, setDates] = useState(() => rand('Low'))
	const [sparse, setSparse] = useState(() => randChartData(counts.Low, { sparse: true }))
	const [brush, setBrush] = useState(() => rand('Med'))
	const [synced1, setSynced1] = useState(() => rand('Low'))
	const [synced2, setSynced2] = useState(() => rand('Low'))

	return (
		<div className='demo'>
			<ChartCard title='Default' onRandomize={(d) => setSingle(rand(d))}>
				{(key) => <LineChart key={key} data={single.data} xKey='label' yKey='a' />}
			</ChartCard>

			<ChartCard title='Gradient fill' onRandomize={(d) => setGradient(rand(d))}>
				{(key) => <LineChart key={key} data={gradient.data} xKey='label' series={[{ key: 'a', fill: 'gradient' }]} />}
			</ChartCard>

			<ChartCard title='Multi-series' onRandomize={(d) => setMulti(rand(d))}>
				{(key) => (
					<LineChart
						key={key}
						data={multi.data}
						xKey='label'
						series={multi.series.map((s, i) => ({
							...s,
							strokeDasharray: ['', '8 2', '2 2'][i],
						}))}
						legend
					/>
				)}
			</ChartCard>

			<ChartCard title='Multi-series with fill' onRandomize={(d) => setMultiFill(rand(d))}>
				{(key) => (
					<LineChart
						key={key}
						data={multiFill.data}
						xKey='label'
						series={multiFill.series.map((s) => ({ ...s, fill: 'gradient' as const }))}
						legend
					/>
				)}
			</ChartCard>

			<ChartCard title='Stacked' onRandomize={(d) => setStacked(rand(d))}>
				{(key) => (
					<LineChart
						key={key}
						data={stacked.data}
						xKey='label'
						series={stacked.series.map((s) => ({ ...s, fill: 'solid' as const }))}
						stacked
						legend
					/>
				)}
			</ChartCard>

			<ChartCard title='Date x-axis' onRandomize={(d) => setDates(rand(d))}>
				{(key) => <LineChart key={key} data={dates.data} xKey='date' yKey='a' xType='date' />}
			</ChartCard>

			<ChartCard title='Sparse dates' onRandomize={(d) => setSparse(randChartData(counts[d], { sparse: true }))}>
				{(key) => <LineChart key={key} data={sparse.data} xKey='date' yKey='a' xType='date' />}
			</ChartCard>

			<ChartCard title='With brush' onRandomize={(d) => setBrush(rand(d))}>
				{(key) => <LineChart key={key} data={brush.data} xKey='label' yKey='a' brush />}
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
						<LineChart key={`a-${key}`} data={synced1.data} xKey='label' yKey='a' syncId='demo' />
						<LineChart key={`b-${key}`} data={synced2.data} xKey='label' yKey='a' syncId='demo' />
					</div>
				)}
			</ChartCard>

			<ChartCard title='With reference line' onRandomize={(d) => setSingle(rand(d))}>
				{(key) => (
					<LineChart key={key} data={single.data} xKey='label' yKey='a' referenceLines={[{ y: 50, label: 'Target' }]} />
				)}
			</ChartCard>
		</div>
	)
}
