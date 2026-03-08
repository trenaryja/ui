import { RadialBarChart } from '@/components'
import type { DemoMeta, Density } from '@demo'
import { ChartCard, densityOptions } from '@demo'
import { useState } from 'react'

export const meta: DemoMeta = { title: 'RadialBarChart', category: 'components', tags: ['chart'] }

const densityCounts: Record<Density, number> = { Low: 2, Med: 4, High: 8 }

const NAMES = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta']

type Item = { name: string; value: number }

const rand = (d: string): Item[] => {
	const n = densityCounts[d as Density]
	return NAMES.slice(0, n).map((name) => ({ name, value: Math.floor(Math.random() * 80) + 20 }))
}

export function Demo() {
	const [data, setData] = useState(() => rand('Low'))

	return (
		<div className='demo'>
			<ChartCard title='Default' densityOptions={densityOptions} onRandomize={(d) => setData(rand(d))}>
				{(key) => <RadialBarChart key={key} data={data} valueKey='value' nameKey='name' legend />}
			</ChartCard>
		</div>
	)
}
