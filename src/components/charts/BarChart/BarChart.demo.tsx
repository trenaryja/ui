import { BarChart, toast } from '@/components'
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
	const [grid, setGrid] = useState(() => rand('Low'))

	return (
		<div className='demo'>
			<ChartCard title='Default' onRandomize={(d) => setSingle(rand(d))}>
				{(key) => <BarChart key={key} data={single.data} domainKey='label' rangeKey='a' />}
			</ChartCard>

			<ChartCard title='Multi-series' onRandomize={(d) => setMulti(rand(d))}>
				{(key) => (
					<BarChart key={key} data={multi.data} domainKey='label' series={multi.series} components={{ legend: true }} />
				)}
			</ChartCard>

			<ChartCard title='Stacked' onRandomize={(d) => setStacked(rand(d))}>
				{(key) => (
					<BarChart
						key={key}
						data={stacked.data}
						domainKey='label'
						series={stacked.series}
						stacked
						components={{ legend: true }}
					/>
				)}
			</ChartCard>

			<ChartCard title='Horizontal' onRandomize={(d) => setHorizontal(rand(d))}>
				{(key) => <BarChart key={key} data={horizontal.data} domainKey='label' rangeKey='a' layout='vertical' />}
			</ChartCard>

			<ChartCard title='Date x-axis' onRandomize={(d) => setDates(rand(d))}>
				{(key) => <BarChart key={key} data={dates.data} domainKey='date' rangeKey='a' domainType='date' />}
			</ChartCard>

			<ChartCard title='Sparse dates' onRandomize={(d) => setSparse(randChartData(counts[d], { sparse: true }))}>
				{(key) => <BarChart key={key} data={sparse.data} domainKey='date' rangeKey='a' domainType='date' />}
			</ChartCard>

			<ChartCard title='With brush' onRandomize={(d) => setBrush(rand(d))}>
				{(key) => (
					<BarChart
						key={key}
						data={brush.data}
						domainKey='label'
						rangeKey='a'
						components={{ brush: true }}
						brushOptions={{ lockRange: true }}
					/>
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
						<BarChart key={`a-${key}`} data={synced1.data} domainKey='label' rangeKey='a' syncId='demo' />
						<BarChart key={`b-${key}`} data={synced2.data} domainKey='label' rangeKey='a' syncId='demo' />
					</div>
				)}
			</ChartCard>

			<ChartCard title='With grid' onRandomize={(d) => setGrid(rand(d))}>
				{(key) => <BarChart key={key} data={grid.data} domainKey='label' rangeKey='a' components={{ grid: true }} />}
			</ChartCard>

			<ChartCard title='Click handler' onRandomize={(d) => setSingle(rand(d))}>
				{(key) => (
					<BarChart
						key={key}
						data={single.data}
						domainKey='label'
						rangeKey='a'
						classNames={{ bar: 'cursor-pointer' }}
						onDataClick={(d) => toast(`${d.label}: ${d.a}`)}
					/>
				)}
			</ChartCard>
		</div>
	)
}
