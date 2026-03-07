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

const sparseCounts: Record<Density, number> = { Low: 10, Med: 30, High: 90 }

const randSparse = (d: string) => genSparseDates(sparseCounts[d as Density]).map((date) => ({ date, count: rand() }))

export function Demo() {
	const [sales, setSales] = useState(() => randSales('Low'))
	const [stacked, setStacked] = useState(() => randStacked('Low'))
	const [horizontal, setHorizontal] = useState(() => randHorizontal('Low'))
	const [events, setEvents] = useState(() => randEvents('Low'))
	const [sparse, setSparse] = useState(() => randSparse('Low'))
	const [brushSales, setBrushSales] = useState(() => randSales('Low'))
	const [refLineSales, setRefLineSales] = useState(() => randSales('Low'))

	return (
		<div className='demo'>
			<ChartCard title='Default' densityOptions={densityOptions} onRandomize={(d) => setSales(randSales(d))}>
				{(key) => <BarChart key={key} data={sales} xKey='week' yKey='sales' />}
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

			<ChartCard title='With brush' densityOptions={densityOptions} onRandomize={(d) => setBrushSales(randSales(d))}>
				{(key) => (
					<BarChart key={key} data={brushSales} xKey='week' yKey='sales' brush brushOptions={{ lockYAxis: true }} />
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
