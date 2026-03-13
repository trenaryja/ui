import { SankeyChart } from '@/components'
import type { DemoMeta } from '@demo'
import { ChartCard, densityOptions } from '@demo'
import { useState } from 'react'
import type { SankeyLink } from './SankeyChart'

export const meta: DemoMeta = { title: 'SankeyChart', category: 'components', tags: ['chart'] }

const funnelByDensity: Record<string, SankeyLink[]> = {
	Low: [
		{ source: 'Visitors', target: 'Converted', value: 350 },
		{ source: 'Visitors', target: 'Dropped', value: 650 },
	],
	Med: [
		{ source: 'Visits', target: 'Signed Up', value: 400 },
		{ source: 'Visits', target: 'Bounced', value: 600 },
		{ source: 'Signed Up', target: 'Purchased', value: 200 },
		{ source: 'Signed Up', target: 'Churned', value: 200 },
	],
	High: [
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
}

const budgetByDensity: Record<string, SankeyLink[]> = {
	Low: [
		{ source: 'Revenue', target: 'Product', value: 200000 },
		{ source: 'Revenue', target: 'Marketing', value: 150000 },
		{ source: 'Revenue', target: 'Profit', value: 150000 },
	],
	Med: [
		{ source: 'Revenue', target: 'R&D', value: 150000 },
		{ source: 'Revenue', target: 'Marketing', value: 100000 },
		{ source: 'Revenue', target: 'Ops', value: 80000 },
		{ source: 'Revenue', target: 'Profit', value: 170000 },
		{ source: 'R&D', target: 'Core', value: 90000 },
		{ source: 'R&D', target: 'Research', value: 60000 },
		{ source: 'Marketing', target: 'Ads', value: 70000 },
		{ source: 'Marketing', target: 'Events', value: 30000 },
	],
	High: [
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
}

const randValues = (base: SankeyLink[]): SankeyLink[] => {
	// Find source nodes (no incoming links)
	const targets = new Set(base.map((l) => l.target))
	const sourceIds = [...new Set(base.map((l) => l.source))].filter((id) => !targets.has(id))

	// Compute source totals
	const sourceTotals = new Map<string, number>()

	for (const link of base)
		if (sourceIds.includes(link.source))
			sourceTotals.set(link.source, (sourceTotals.get(link.source) ?? 0) + link.value)

	const totalValue = [...sourceTotals.values()].reduce((a, b) => a + b, 0)
	const randomTotal = Math.floor(totalValue * (0.5 + Math.random()))

	// Group outgoing links by source
	const outgoing = Map.groupBy(base, (l) => l.source)

	// Compute node inflow from links
	const nodeValue = new Map(
		sourceIds.map((id) => [id, Math.floor(((sourceTotals.get(id) ?? 0) / totalValue) * randomTotal)]),
	)

	// BFS from sources, splitting each node's value randomly among its outgoing links
	const newValues = new Map(base.map((l) => [`${l.source}->${l.target}`, l.value]))
	const queue = [...sourceIds]

	while (queue.length) {
		const id = queue.shift()!
		const out = outgoing.get(id)
		if (!out) continue
		const available = nodeValue.get(id)!
		const weights = out.map(() => Math.random() + 0.1)
		const weightSum = weights.reduce((a, b) => a + b, 0)
		let remaining = available
		out.forEach((link, i) => {
			const val = i === out.length - 1 ? remaining : Math.max(1, Math.floor((weights[i] / weightSum) * available))
			remaining -= val
			newValues.set(`${link.source}->${link.target}`, val)
			nodeValue.set(link.target, (nodeValue.get(link.target) ?? 0) + val)
			if (!queue.includes(link.target) && outgoing.has(link.target)) queue.push(link.target)
		})
	}

	return base.map((l) => ({ ...l, value: newValues.get(`${l.source}->${l.target}`) ?? l.value }))
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
