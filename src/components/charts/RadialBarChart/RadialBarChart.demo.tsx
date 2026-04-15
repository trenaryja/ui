import { RadialBarChart, toast } from '@/components'
import type { DemoMeta, Density } from '@demo'
import { ChartCard, randChartData } from '@demo'
import { useState } from 'react'

export const meta: DemoMeta = { title: 'RadialBarChart', category: 'components', tags: ['chart'] }

const counts: Record<Density, number> = { Low: 2, Med: 4, High: 8 }
const rand = (d: Density) => randChartData(counts[d])

export function Demo() {
	const [data, setData] = useState(() => rand('Low'))

	return (
		<div className='demo'>
			<ChartCard title='Default' onRandomize={(d) => setData(rand(d))}>
				{(key) => <RadialBarChart key={key} data={data.data} valueKey='a' nameKey='name' />}
			</ChartCard>

			<ChartCard title='Click handler' onRandomize={(d) => setData(rand(d))}>
				{(key) => (
					<RadialBarChart
						key={key}
						data={data.data}
						valueKey='a'
						nameKey='name'
						classNames={{ radialBar: 'cursor-pointer' }}
						onDataClick={(d) => toast(`${d.name}: ${d.a}`)}
					/>
				)}
			</ChartCard>
		</div>
	)
}
