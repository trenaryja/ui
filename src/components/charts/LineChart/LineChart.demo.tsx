import { LineChart } from '@/components'
import type { DemoMeta, Density } from '@demo'
import { ChartCard, densityOptions, genDates, genLabels, genSparseDates, rand } from '@demo'
import { useState } from 'react'

export const meta: DemoMeta = { title: 'LineChart', category: 'components', tags: ['chart'] }

const densityCounts: Record<Density, number> = { Low: 7, Med: 30, High: 365 }

const randVisits = (d: string) => {
	const n = densityCounts[d as Density]
	return genLabels(n).map((day) => ({ day, visits: rand() }))
}

const randEvents = (d: string) => {
	const n = densityCounts[d as Density]
	return genDates(n).map((date) => ({ date, count: rand() }))
}

const sparseCounts: Record<Density, number> = { Low: 10, Med: 30, High: 90 }

const randSparse = (d: string) => genSparseDates(sparseCounts[d as Density]).map((date) => ({ date, count: rand() }))

const randMulti = (d: string) => {
	const n = densityCounts[d as Density]
	return genLabels(n).map((day) => ({ day, pageviews: rand(), sessions: rand(), users: rand() }))
}

export function Demo() {
	const [visits, setVisits] = useState(() => randVisits('Low'))
	const [gradient, setGradient] = useState(() => randVisits('Low'))
	const [multi, setMulti] = useState(() => randMulti('Low'))
	const [multiFill, setMultiFill] = useState(() => randMulti('Low'))
	const [events, setEvents] = useState(() => randEvents('Low'))
	const [sparse, setSparse] = useState(() => randSparse('Low'))
	const [brush, setBrush] = useState(() => randVisits('Med'))
	const [synced1, setSynced1] = useState(() => randVisits('Low'))
	const [synced2, setSynced2] = useState(() => randVisits('Low'))

	return (
		<div className='demo'>
			<ChartCard title='Default' densityOptions={densityOptions} onRandomize={(d) => setVisits(randVisits(d))}>
				{(key) => <LineChart key={key} data={visits} xKey='day' yKey='visits' />}
			</ChartCard>

			<ChartCard title='Gradient fill' densityOptions={densityOptions} onRandomize={(d) => setGradient(randVisits(d))}>
				{(key) => <LineChart key={key} data={gradient} xKey='day' series={[{ key: 'visits', fill: 'gradient' }]} />}
			</ChartCard>

			<ChartCard title='Multi-series' densityOptions={densityOptions} onRandomize={(d) => setMulti(randMulti(d))}>
				{(key) => (
					<LineChart
						key={key}
						data={multi}
						xKey='day'
						series={[
							{ key: 'pageviews', label: 'Pageviews' },
							{ key: 'sessions', label: 'Sessions', strokeDasharray: '4 2' },
							{ key: 'users', label: 'Users', strokeDasharray: '2 2' },
						]}
						legend
					/>
				)}
			</ChartCard>

			<ChartCard
				title='Multi-series with fill'
				densityOptions={densityOptions}
				onRandomize={(d) => setMultiFill(randMulti(d))}
			>
				{(key) => (
					<LineChart
						key={key}
						data={multiFill}
						xKey='day'
						series={[
							{ key: 'pageviews', label: 'Pageviews', fill: 'gradient' },
							{ key: 'sessions', label: 'Sessions', fill: 'gradient' },
							{ key: 'users', label: 'Users', fill: 'gradient' },
						]}
						legend
					/>
				)}
			</ChartCard>

			<ChartCard title='Date x-axis' densityOptions={densityOptions} onRandomize={(d) => setEvents(randEvents(d))}>
				{(key) => <LineChart key={key} data={events} xKey='date' yKey='count' xType='date' />}
			</ChartCard>

			<ChartCard title='Sparse dates' densityOptions={densityOptions} onRandomize={(d) => setSparse(randSparse(d))}>
				{(key) => <LineChart key={key} data={sparse} xKey='date' yKey='count' xType='date' />}
			</ChartCard>

			<ChartCard title='With brush' densityOptions={densityOptions} onRandomize={(d) => setBrush(randVisits(d))}>
				{(key) => <LineChart key={key} data={brush} xKey='day' yKey='visits' brush />}
			</ChartCard>

			<ChartCard
				title='Synced charts'
				densityOptions={densityOptions}
				onRandomize={(d) => {
					setSynced1(randVisits(d))
					setSynced2(randVisits(d))
				}}
			>
				{(key) => (
					<div className='grid grid-cols-1 gap-2 sm:grid-cols-2'>
						<LineChart key={`a-${key}`} data={synced1} xKey='day' yKey='visits' syncId='demo' />
						<LineChart key={`b-${key}`} data={synced2} xKey='day' yKey='visits' syncId='demo' />
					</div>
				)}
			</ChartCard>

			<ChartCard
				title='With reference line'
				densityOptions={densityOptions}
				onRandomize={(d) => setVisits(randVisits(d))}
			>
				{(key) => (
					<LineChart key={key} data={visits} xKey='day' yKey='visits' referenceLines={[{ y: 100, label: 'Target' }]} />
				)}
			</ChartCard>
		</div>
	)
}
