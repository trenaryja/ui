import { RadarChart, toast } from '@/components'
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
				{(key) => <RadarChart key={key} data={single.data} angleKey='name' rangeKey='a' />}
			</ChartCard>

			<ChartCard title='Multi-series' onRandomize={(d) => setMulti(rand(d))}>
				{(key) => (
					<RadarChart key={key} data={multi.data} angleKey='name' series={multi.series} components={{ legend: true }} />
				)}
			</ChartCard>

			<ChartCard title='Click handler' onRandomize={(d) => setSingle(rand(d))}>
				{(key) => (
					<RadarChart
						key={key}
						data={single.data}
						angleKey='name'
						rangeKey='a'
						classNames={{ radar: 'cursor-pointer' }}
						onDataClick={(d) => toast(`${d.name}: ${d.a}`)}
					/>
				)}
			</ChartCard>
		</div>
	)
}
