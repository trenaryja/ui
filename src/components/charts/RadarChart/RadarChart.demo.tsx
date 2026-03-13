import { RadarChart } from '@/components'
import type { DemoMeta, Density } from '@demo'
import { ChartCard, densityOptions } from '@demo'
import { useState } from 'react'

export const meta: DemoMeta = { title: 'RadarChart', category: 'components', tags: ['chart'] }

const densityCounts: Record<Density, number> = { Low: 4, Med: 6, High: 8 }

const SUBJECTS = ['Speed', 'Strength', 'Agility', 'Endurance', 'Skill', 'Teamwork', 'Intelligence', 'Flexibility']

type Stat = { subject: string; score: number }

type CompStat = { subject: string; alpha: number; beta: number }

const randSingle = (d: string): Stat[] => {
	const n = densityCounts[d as Density]
	return SUBJECTS.slice(0, n).map((subject) => ({ subject, score: Math.floor(Math.random() * 80) + 20 }))
}

const randMulti = (d: string): CompStat[] => {
	const n = densityCounts[d as Density]
	return SUBJECTS.slice(0, n).map((subject) => ({
		subject,
		alpha: Math.floor(Math.random() * 80) + 20,
		beta: Math.floor(Math.random() * 80) + 20,
	}))
}

export function Demo() {
	const [single, setSingle] = useState(() => randSingle('Low'))
	const [multi, setMulti] = useState(() => randMulti('Low'))

	return (
		<div className='demo'>
			<ChartCard title='Default' densityOptions={densityOptions} onRandomize={(d) => setSingle(randSingle(d))}>
				{(key) => <RadarChart key={key} data={single} angleKey='subject' yKey='score' />}
			</ChartCard>

			<ChartCard title='Multi-series' densityOptions={densityOptions} onRandomize={(d) => setMulti(randMulti(d))}>
				{(key) => (
					<RadarChart
						key={key}
						data={multi}
						angleKey='subject'
						series={[
							{ key: 'alpha', label: 'Alpha' },
							{ key: 'beta', label: 'Beta' },
						]}
						legend
					/>
				)}
			</ChartCard>
		</div>
	)
}
