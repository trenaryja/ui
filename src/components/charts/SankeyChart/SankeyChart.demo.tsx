import { SankeyChart } from '@/components'
import type { DemoMeta, Density } from '@demo'
import { ChartCard } from '@demo'
import { faker } from '@faker-js/faker'
import { capitalize, groupBy, sum } from 'remeda'
import { useState } from 'react'
import type { SankeyLink } from './SankeyChart'

export const meta: DemoMeta = { title: 'SankeyChart', category: 'components', tags: ['chart'] }

const depths: Record<Density, number> = { Low: 3, Med: 4, High: 5 }
const widthRange: Record<Density, [number, number]> = { Low: [2, 4], Med: [3, 5], High: [3, 6] }

/** Random layer widths for flow/funnel (no shape constraint) */
const randWidths = (d: Density) =>
	Array.from({ length: depths[d] }, () => faker.number.int({ min: widthRange[d][0], max: widthRange[d][1] }))

/** Growing widths for diverging: 1 → 2-3 → 4-6 → ... */
const growingWidths = (d: Density) => {
	const widths = [1]
	for (let i = 1; i < depths[d]; i++) widths.push(widths[i - 1] + faker.number.int({ min: 1, max: 3 }))
	return widths
}

/** Shrinking widths for converging: ... → 4-6 → 2-3 → 1 */
const shrinkingWidths = (d: Density) => growingWidths(d).reverse()

/** Generate layers of unique capitalized names */
const makeLayers = (widths: number[]): string[][] => {
	const all = faker.helpers.uniqueArray(faker.word.noun, sum(widths)).map((s) => capitalize(s))
	const result: string[][] = []
	let i = 0

	for (const n of widths) {
		result.push(all.slice(i, i + n))
		i += n
	}

	return result
}

/** Split `total` into `n` positive integers that sum exactly to `total` */
const splitValue = (total: number, n: number): number[] => {
	if (n === 1) return [total]
	const weights = Array.from({ length: n }, () => faker.number.float({ min: 0.1, max: 1 }))
	const wSum = sum(weights)
	const parts = weights.map((w) => Math.max(1, Math.floor((w / wSum) * total)))
	parts[parts.length - 1] += total - sum(parts)
	return parts
}

/** Build edges → assign flow-conserving values → produce SankeyLink[] */
const buildLinks = (layers: string[][], edges: [string, string][]): SankeyLink[] => {
	const outgoing = groupBy(edges, ([s]) => s)

	const nodeTotal = new Map<string, number>()
	const linkValue = new Map<string, number>()
	for (const node of layers[0]) nodeTotal.set(node, faker.number.int({ min: 200, max: 800 }))

	for (let i = 0; i < layers.length - 1; i++)
		for (const node of layers[i]) {
			const out = outgoing[node]
			if (!out?.length) continue
			const values = splitValue(nodeTotal.get(node)!, out.length)
			out.forEach(([s, t], j) => {
				linkValue.set(`${s}\0${t}`, values[j])
				nodeTotal.set(t, (nodeTotal.get(t) ?? 0) + values[j])
			})
		}

	return edges.map(([s, t]) => ({ source: s, target: t, value: linkValue.get(`${s}\0${t}`) ?? 1 }))
}

/** Deduplicated edge collector for generators with random connections */
const edgeCollector = () => {
	const seen = new Set<string>()
	const edges: [string, string][] = []

	const add = (s: string, t: string) => {
		const key = `${s}\0${t}`
		if (seen.has(key)) return
		seen.add(key)
		edges.push([s, t])
	}

	return { edges, add }
}

// ── Diverging: pure tree fan-out, each child has exactly one parent ──

const randDiverging = (d: Density): SankeyLink[] => {
	const layers = makeLayers(growingWidths(d))
	const edges: [string, string][] = []

	for (let i = 0; i < layers.length - 1; i++)
		for (let c = 0; c < layers[i + 1].length; c++) edges.push([layers[i][c % layers[i].length], layers[i + 1][c]])

	return buildLinks(layers, edges)
}

// ── Converging: multiple sources merge into one sink ──

const randConverging = (d: Density): SankeyLink[] => {
	const layers = makeLayers(shrinkingWidths(d))
	const edges: [string, string][] = []

	for (let i = 0; i < layers.length - 1; i++)
		for (let p = 0; p < layers[i].length; p++) edges.push([layers[i][p], layers[i + 1][p % layers[i + 1].length]])

	return buildLinks(layers, edges)
}

// ── Flow: general random connections between layers ──

const randFlow = (d: Density): SankeyLink[] => {
	const layers = makeLayers(randWidths(d))
	const { edges, add } = edgeCollector()

	for (let i = 0; i < layers.length - 1; i++) {
		const parents = layers[i]
		const children = layers[i + 1]
		for (const p of parents) add(p, faker.helpers.arrayElement(children))
		for (const c of children) add(faker.helpers.arrayElement(parents), c)
		for (let e = 0; e < parents.length + children.length; e++)
			add(faker.helpers.arrayElement(parents), faker.helpers.arrayElement(children))
	}

	return buildLinks(layers, edges)
}

// ── Funnel: flow diminishes — some intermediate nodes don't connect forward ──

const randFunnel = (d: Density): SankeyLink[] => {
	const layers = makeLayers(randWidths(d))
	const { edges, add } = edgeCollector()

	for (let i = 0; i < layers.length - 1; i++) {
		const parents = layers[i]
		const children = layers[i + 1]
		const active = faker.helpers.arrayElements(parents, { min: 1, max: Math.max(1, parents.length - 1) })
		for (const p of active) add(p, faker.helpers.arrayElement(children))
		for (const c of children) add(faker.helpers.arrayElement(active), c)
	}

	return buildLinks(layers, edges)
}

export function Demo() {
	const [diverging, setDiverging] = useState(() => randDiverging('Low'))
	const [converging, setConverging] = useState(() => randConverging('Low'))
	const [flow, setFlow] = useState(() => randFlow('Low'))
	const [funnel, setFunnel] = useState(() => randFunnel('Low'))

	return (
		<div className='demo'>
			<ChartCard title='Flow' onRandomize={(d) => setFlow(randFlow(d))}>
				{(key) => <SankeyChart key={key} data={flow} />}
			</ChartCard>

			<ChartCard title='Diverging' onRandomize={(d) => setDiverging(randDiverging(d))}>
				{(key) => <SankeyChart key={key} data={diverging} />}
			</ChartCard>

			<ChartCard title='Converging' onRandomize={(d) => setConverging(randConverging(d))}>
				{(key) => <SankeyChart key={key} data={converging} />}
			</ChartCard>

			<ChartCard title='Funnel' onRandomize={(d) => setFunnel(randFunnel(d))}>
				{(key) => <SankeyChart key={key} data={funnel} />}
			</ChartCard>
		</div>
	)
}
