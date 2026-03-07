import { SankeyChart } from '@/components'
import type { DemoMeta } from '@demo'
import { ChartCard, densityOptions } from '@demo'
import { useState } from 'react'
import type { SankeyData } from './SankeyChart'

export const meta: DemoMeta = { title: 'SankeyChart', category: 'components', tags: ['chart'] }

const funnelByDensity: Record<string, SankeyData> = {
	Low: {
		nodes: [
			{ id: 'Visitors', value: 1000 },
			{ id: 'Converted', value: 350 },
			{ id: 'Dropped', value: 650 },
		],
		links: [
			{ source: 'Visitors', target: 'Converted', value: 350 },
			{ source: 'Visitors', target: 'Dropped', value: 650 },
		],
	},
	Med: {
		nodes: [
			{ id: 'Visits', value: 1000 },
			{ id: 'Signed Up', value: 400 },
			{ id: 'Bounced', value: 600 },
			{ id: 'Purchased', value: 200 },
			{ id: 'Churned', value: 200 },
		],
		links: [
			{ source: 'Visits', target: 'Signed Up', value: 400 },
			{ source: 'Visits', target: 'Bounced', value: 600 },
			{ source: 'Signed Up', target: 'Purchased', value: 200 },
			{ source: 'Signed Up', target: 'Churned', value: 200 },
		],
	},
	High: {
		nodes: [
			{ id: 'Traffic', value: 1000 },
			{ id: 'Organic', value: 450 },
			{ id: 'Paid', value: 350 },
			{ id: 'Referral', value: 200 },
			{ id: 'Signup', value: 400 },
			{ id: 'Bounce', value: 600 },
			{ id: 'Active', value: 250 },
			{ id: 'Churned', value: 150 },
		],
		links: [
			{ source: 'Traffic', target: 'Organic', value: 450 },
			{ source: 'Traffic', target: 'Paid', value: 350 },
			{ source: 'Traffic', target: 'Referral', value: 200 },
			{ source: 'Organic', target: 'Signup', value: 200 },
			{ source: 'Paid', target: 'Signup', value: 150 },
			{ source: 'Referral', target: 'Signup', value: 50 },
			{ source: 'Organic', target: 'Bounce', value: 250 },
			{ source: 'Paid', target: 'Bounce', value: 200 },
			{ source: 'Referral', target: 'Bounce', value: 150 },
			{ source: 'Signup', target: 'Active', value: 250 },
			{ source: 'Signup', target: 'Churned', value: 150 },
		],
	},
}

const budgetByDensity: Record<string, SankeyData> = {
	Low: {
		nodes: [
			{ id: 'Revenue', value: 500000 },
			{ id: 'Product', value: 200000 },
			{ id: 'Marketing', value: 150000 },
			{ id: 'Profit', value: 150000 },
		],
		links: [
			{ source: 'Revenue', target: 'Product', value: 200000 },
			{ source: 'Revenue', target: 'Marketing', value: 150000 },
			{ source: 'Revenue', target: 'Profit', value: 150000 },
		],
	},
	Med: {
		nodes: [
			{ id: 'Revenue', value: 500000 },
			{ id: 'R&D', value: 150000 },
			{ id: 'Marketing', value: 100000 },
			{ id: 'Ops', value: 80000 },
			{ id: 'Profit', value: 170000 },
			{ id: 'Core', value: 90000 },
			{ id: 'Research', value: 60000 },
			{ id: 'Ads', value: 70000 },
			{ id: 'Events', value: 30000 },
		],
		links: [
			{ source: 'Revenue', target: 'R&D', value: 150000 },
			{ source: 'Revenue', target: 'Marketing', value: 100000 },
			{ source: 'Revenue', target: 'Ops', value: 80000 },
			{ source: 'Revenue', target: 'Profit', value: 170000 },
			{ source: 'R&D', target: 'Core', value: 90000 },
			{ source: 'R&D', target: 'Research', value: 60000 },
			{ source: 'Marketing', target: 'Ads', value: 70000 },
			{ source: 'Marketing', target: 'Events', value: 30000 },
		],
	},
	High: {
		nodes: [
			{ id: 'Revenue', value: 500000 },
			{ id: 'R&D', value: 150000 },
			{ id: 'Marketing', value: 100000 },
			{ id: 'Ops', value: 80000 },
			{ id: 'Profit', value: 170000 },
			{ id: 'Core', value: 90000 },
			{ id: 'Research', value: 60000 },
			{ id: 'Ads', value: 70000 },
			{ id: 'Events', value: 30000 },
			{ id: 'Infra', value: 50000 },
			{ id: 'Support', value: 30000 },
			{ id: 'Reinvest', value: 100000 },
			{ id: 'Dividends', value: 70000 },
		],
		links: [
			{ source: 'Revenue', target: 'R&D', value: 150000 },
			{ source: 'Revenue', target: 'Marketing', value: 100000 },
			{ source: 'Revenue', target: 'Ops', value: 80000 },
			{ source: 'Revenue', target: 'Profit', value: 170000 },
			{ source: 'R&D', target: 'Core', value: 90000 },
			{ source: 'R&D', target: 'Research', value: 60000 },
			{ source: 'Marketing', target: 'Ads', value: 70000 },
			{ source: 'Marketing', target: 'Events', value: 30000 },
			{ source: 'Ops', target: 'Infra', value: 50000 },
			{ source: 'Ops', target: 'Support', value: 30000 },
			{ source: 'Profit', target: 'Reinvest', value: 100000 },
			{ source: 'Profit', target: 'Dividends', value: 70000 },
		],
	},
}

const randValues = (base: SankeyData): SankeyData => {
	const scale = Math.max(...base.links.map((l) => l.value))
	return {
		...base,
		links: base.links.map((l) => ({ ...l, value: Math.floor(Math.random() * scale) + Math.floor(scale / 10) })),
	}
}

export function Demo() {
	const [funnel, setFunnel] = useState(funnelByDensity.Low)
	const [budget, setBudget] = useState(budgetByDensity.Low)

	return (
		<div className='demo'>
			<ChartCard
				title='Conversion funnel'
				densityOptions={densityOptions}
				onRandomize={(d) => setFunnel(randValues(funnelByDensity[d]))}
			>
				{(key) => <SankeyChart key={key} data={funnel} />}
			</ChartCard>

			<ChartCard
				title='Budget allocation'
				densityOptions={densityOptions}
				onRandomize={(d) => setBudget(randValues(budgetByDensity[d]))}
			>
				{(key) => <SankeyChart key={key} data={budget} />}
			</ChartCard>
		</div>
	)
}
