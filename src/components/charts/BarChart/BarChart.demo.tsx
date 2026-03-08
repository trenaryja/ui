import { BarChart } from '@/components'
import type { DemoMeta, Density } from '@demo'
import { ChartCard, densityOptions, genDates, genLabels, genSparseDates, rand } from '@demo'
import { useState } from 'react'

export const meta: DemoMeta = { title: 'BarChart', category: 'components', tags: ['chart'] }

const densityCounts: Record<Density, number> = { Low: 7, Med: 30, High: 365 }

const randSales = (d: string) => {
	const n = densityCounts[d as Density]
	return genLabels(n).map((week) => ({ week, sales: rand() }))
}

const randStacked = (d: string) => {
	const n = densityCounts[d as Density]
	return genLabels(n).map((week) => ({ week, direct: rand(), organic: rand(), referral: rand() }))
}

const randHorizontal = (d: string) => {
	const n = densityCounts[d as Density]
	return genLabels(n).map((week) => ({ week, revenue: rand() }))
}

const randEvents = (d: string) => {
	const n = densityCounts[d as Density]
	return genDates(n).map((date) => ({ date, count: rand() }))
}

const timeSeriesConfig: Record<Density, { count: number; intervalMin: number }> = {
	Low: { count: 24, intervalMin: 15 }, // 6 hours
	Med: { count: 48, intervalMin: 30 }, // 24 hours
	High: { count: 72, intervalMin: 60 }, // 3 days
}

const randTimeSeries = (d: string) => {
	const { count, intervalMin } = timeSeriesConfig[d as Density]
	const start = new Date()
	start.setHours(21, 0, 0, 0) // 9 PM — crosses midnight
	return Array.from({ length: count }, (_, i) => {
		const t = new Date(start)
		t.setMinutes(t.getMinutes() + i * intervalMin)
		return { time: t.toISOString(), readings: Math.floor(Math.random() * 40 + 60) }
	})
}

const sparseCounts: Record<Density, number> = { Low: 10, Med: 30, High: 90 }

const randSparse = (d: string) => genSparseDates(sparseCounts[d as Density]).map((date) => ({ date, count: rand() }))

export function Demo() {
	const [sales, setSales] = useState(() => randSales('Low'))
	const [multiSeries, setMultiSeries] = useState(() => randStacked('Low'))
	const [stacked, setStacked] = useState(() => randStacked('Low'))
	const [horizontal, setHorizontal] = useState(() => randHorizontal('Low'))
	const [events, setEvents] = useState(() => randEvents('Low'))
	const [sparse, setSparse] = useState(() => randSparse('Low'))
	const [timeSeries, setTimeSeries] = useState(() => randTimeSeries('Low'))
	const [brushSales, setBrushSales] = useState(() => randSales('Low'))
	const [synced1, setSynced1] = useState(() => randSales('Low'))
	const [synced2, setSynced2] = useState(() => randSales('Low'))
	const [refLineSales, setRefLineSales] = useState(() => randSales('Low'))

	return (
		<div className='demo'>
			<ChartCard title='Default' densityOptions={densityOptions} onRandomize={(d) => setSales(randSales(d))}>
				{(key) => <BarChart key={key} data={sales} xKey='week' yKey='sales' />}
			</ChartCard>

			<ChartCard
				title='Multi-series'
				densityOptions={densityOptions}
				onRandomize={(d) => setMultiSeries(randStacked(d))}
			>
				{(key) => (
					<BarChart
						key={key}
						data={multiSeries}
						xKey='week'
						series={[
							{ key: 'direct', label: 'Direct' },
							{ key: 'organic', label: 'Organic' },
							{ key: 'referral', label: 'Referral' },
						]}
						legend
					/>
				)}
			</ChartCard>

			<ChartCard title='Stacked' densityOptions={densityOptions} onRandomize={(d) => setStacked(randStacked(d))}>
				{(key) => (
					<BarChart
						key={key}
						data={stacked}
						xKey='week'
						series={[
							{ key: 'direct', label: 'Direct' },
							{ key: 'organic', label: 'Organic' },
							{ key: 'referral', label: 'Referral' },
						]}
						stacked
						legend
					/>
				)}
			</ChartCard>

			<ChartCard title='Horizontal' onRandomize={(d) => setHorizontal(randHorizontal(d))}>
				{(key) => <BarChart key={key} data={horizontal} xKey='week' yKey='revenue' layout='vertical' />}
			</ChartCard>

			<ChartCard title='Date x-axis' densityOptions={densityOptions} onRandomize={(d) => setEvents(randEvents(d))}>
				{(key) => <BarChart key={key} data={events} xKey='date' yKey='count' xType='date' />}
			</ChartCard>

			<ChartCard title='Sparse dates' densityOptions={densityOptions} onRandomize={(d) => setSparse(randSparse(d))}>
				{(key) => <BarChart key={key} data={sparse} xKey='date' yKey='count' xType='date' />}
			</ChartCard>

			<ChartCard
				title='Time series'
				densityOptions={densityOptions}
				onRandomize={(d) => setTimeSeries(randTimeSeries(d))}
			>
				{(key) => <BarChart key={key} data={timeSeries} xKey='time' yKey='readings' xType='date' />}
			</ChartCard>

			<ChartCard title='With brush' densityOptions={densityOptions} onRandomize={(d) => setBrushSales(randSales(d))}>
				{(key) => (
					<BarChart key={key} data={brushSales} xKey='week' yKey='sales' brush brushOptions={{ lockYAxis: true }} />
				)}
			</ChartCard>

			<ChartCard
				title='Synced charts'
				densityOptions={densityOptions}
				onRandomize={(d) => {
					setSynced1(randSales(d))
					setSynced2(randSales(d))
				}}
			>
				{(key) => (
					<div className='grid gap-2 md:grid-cols-2'>
						<div className='h-64'>
							<BarChart key={`a-${key}`} data={synced1} xKey='week' yKey='sales' syncId='demo' />
						</div>
						<div className='h-64'>
							<BarChart key={`b-${key}`} data={synced2} xKey='week' yKey='sales' syncId='demo' />
						</div>
					</div>
				)}
			</ChartCard>

			<ChartCard
				title='With reference line'
				densityOptions={densityOptions}
				onRandomize={(d) => setRefLineSales(randSales(d))}
			>
				{(key) => (
					<BarChart
						key={key}
						data={refLineSales}
						xKey='week'
						yKey='sales'
						referenceLines={[{ y: 50, label: 'Target' }]}
					/>
				)}
			</ChartCard>
		</div>
	)
}
