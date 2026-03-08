import { PieChart } from '@/components'
import type { DemoMeta, Density } from '@demo'
import { ChartCard, densityOptions } from '@demo'
import { useState } from 'react'

export const meta: DemoMeta = { title: 'PieChart', category: 'components', tags: ['chart'] }

const densityCounts: Record<Density, number> = { Low: 2, Med: 4, High: 8 }

const NAMES = ['Direct', 'Organic', 'Referral', 'Social', 'Email', 'Paid', 'Affiliate', 'Display']

type Slice = { name: string; value: number }

const rand = (d: string): Slice[] => {
	const n = densityCounts[d as Density]
	return NAMES.slice(0, n).map((name) => ({ name, value: Math.floor(Math.random() * 400) + 100 }))
}

export function Demo() {
	const [pie, setPie] = useState(() => rand('Low'))
	const [donut, setDonut] = useState(() => rand('Low'))
	const [noGapPie, setNoGapPie] = useState(() => rand('Low'))
	const [monoPie, setMonoPie] = useState(() => rand('Low'))
	const [monoDonut, setMonoDonut] = useState(() => rand('Low'))

	return (
		<div className='demo'>
			<ChartCard title='Pie' densityOptions={densityOptions} onRandomize={(d) => setPie(rand(d))}>
				{(key) => <PieChart key={key} data={pie} valueKey='value' nameKey='name' legend />}
			</ChartCard>

			<ChartCard title='Donut' densityOptions={densityOptions} onRandomize={(d) => setDonut(rand(d))}>
				{(key) => <PieChart key={key} data={donut} valueKey='value' nameKey='name' donut legend />}
			</ChartCard>

			<ChartCard title='Pie, noGap' densityOptions={densityOptions} onRandomize={(d) => setNoGapPie(rand(d))}>
				{(key) => <PieChart key={key} data={noGapPie} valueKey='value' nameKey='name' noGap legend />}
			</ChartCard>

			<ChartCard title='Pie, custom colors' densityOptions={densityOptions} onRandomize={(d) => setMonoPie(rand(d))}>
				{(key) => (
					<PieChart
						key={key}
						data={monoPie}
						valueKey='value'
						nameKey='name'
						colors={[
							'var(--color-base-content)',
							'var(--color-primary)',
							'var(--color-secondary)',
							'var(--color-base-300)',
						]}
						legend
					/>
				)}
			</ChartCard>

			<ChartCard
				title='Donut, custom colors'
				densityOptions={densityOptions}
				onRandomize={(d) => setMonoDonut(rand(d))}
			>
				{(key) => (
					<PieChart
						key={key}
						data={monoDonut}
						valueKey='value'
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
