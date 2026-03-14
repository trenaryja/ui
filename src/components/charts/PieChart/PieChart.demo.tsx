import { PieChart } from '@/components'
import type { DemoMeta, Density } from '@demo'
import { ChartCard, randChartData } from '@demo'
import { useState } from 'react'

export const meta: DemoMeta = { title: 'PieChart', category: 'components', tags: ['chart'] }

const counts: Record<Density, number> = { Low: 2, Med: 4, High: 8 }
const rand = (d: Density) => randChartData(counts[d])

export function Demo() {
	const [pie, setPie] = useState(() => rand('Low'))
	const [donut, setDonut] = useState(() => rand('Low'))
	const [noGapPie, setNoGapPie] = useState(() => rand('Low'))
	const [monoPie, setMonoPie] = useState(() => rand('Low'))
	const [monoDonut, setMonoDonut] = useState(() => rand('Low'))

	return (
		<div className='demo'>
			<ChartCard title='Pie' onRandomize={(d) => setPie(rand(d))}>
				{(key) => <PieChart key={key} data={pie.data} valueKey='a' nameKey='name' legend />}
			</ChartCard>

			<ChartCard title='Donut' onRandomize={(d) => setDonut(rand(d))}>
				{(key) => <PieChart key={key} data={donut.data} valueKey='a' nameKey='name' donut legend />}
			</ChartCard>

			<ChartCard title='Pie, noGap' onRandomize={(d) => setNoGapPie(rand(d))}>
				{(key) => <PieChart key={key} data={noGapPie.data} valueKey='a' nameKey='name' noGap legend />}
			</ChartCard>

			<ChartCard title='Pie, custom colors' onRandomize={(d) => setMonoPie(rand(d))}>
				{(key) => (
					<PieChart
						key={key}
						data={monoPie.data}
						valueKey='a'
						nameKey='name'
						colors={[
							'var(--color-base-content)',
							'var(--color-secondary)',
							'var(--color-base-300)',
							'var(--color-primary)',
						]}
						legend
					/>
				)}
			</ChartCard>

			<ChartCard title='Donut, custom colors' onRandomize={(d) => setMonoDonut(rand(d))}>
				{(key) => (
					<PieChart
						key={key}
						data={monoDonut.data}
						valueKey='a'
						nameKey='name'
						donut
						colors={['var(--color-base-content)', 'var(--color-base-300)']}
						legend
					/>
				)}
			</ChartCard>
		</div>
	)
}
