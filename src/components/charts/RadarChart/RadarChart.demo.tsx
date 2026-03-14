import { RadarChart } from '@/components'
import type { DemoMeta, Density } from '@demo'
import { ChartCard, randChartData } from '@demo'
import { useState } from 'react'

export const meta: DemoMeta = { title: 'RadarChart', category: 'components', tags: ['chart'] }

const counts: Record<Density, number> = { Low: 4, Med: 6, High: 8 }
const rand = (d: Density) => randChartData(counts[d])

export function Demo() {
	const [single, setSingle] = useState(() => rand('Low'))
	const [multi, setMulti] = useState(() => rand('Low'))

	return (
		<div className='demo'>
			<ChartCard title='Default' onRandomize={(d) => setSingle(rand(d))}>
				{(key) => <RadarChart key={key} data={single.data} angleKey='name' yKey='a' />}
			</ChartCard>

			<ChartCard title='Multi-series' onRandomize={(d) => setMulti(rand(d))}>
				{(key) => <RadarChart key={key} data={multi.data} angleKey='name' series={multi.series} legend />}
			</ChartCard>
		</div>
	)
}
