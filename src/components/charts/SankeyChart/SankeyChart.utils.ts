import type { SankeyLink } from './SankeyChart'

type Adjacency = {
	outgoing: Map<string, SankeyLink[]>
	incoming: Map<string, SankeyLink[]>
}

const buildAdjacency = (links: SankeyLink[]): Adjacency => ({
	outgoing: Map.groupBy(links, (l) => l.source),
	incoming: Map.groupBy(links, (l) => l.target),
})

const assignDepths = (nodeIds: string[], adj: Adjacency) => {
	const sources = nodeIds.filter((id) => !adj.incoming.has(id))
	const depth = new Map(sources.map((id) => [id, 0]))
	const queue = [...sources]

	while (queue.length) {
		const id = queue.shift()!
		const d = depth.get(id)!

		for (const link of adj.outgoing.get(id) ?? []) {
			const prev = depth.get(link.target) ?? -1

			if (d + 1 > prev) {
				depth.set(link.target, d + 1)
				queue.push(link.target)
			}
		}
	}

	return depth
}

const buildLayers = (nodeIds: string[], depth: Map<string, number>) => {
	const maxDepth = Math.max(...Array.from(depth.values()), 0)
	const layers: string[][] = Array.from({ length: maxDepth + 1 }, () => [])
	for (const id of nodeIds) layers[depth.get(id) ?? 0].push(id)

	return layers
}

const barycenterSort = (layers: string[][], adj: Adjacency) => {
	const maxDepth = layers.length - 1
	const position = new Map<string, number>()
	for (const layer of layers) layer.forEach((id, i) => position.set(id, i))

	for (let iter = 0; iter < 8; iter++) {
		for (let d = 1; d <= maxDepth; d++) {
			layers[d].sort((a, b) => {
				const avg = (id: string) => {
					const links = adj.incoming.get(id) ?? []
					return links.length ? links.reduce((s, l) => s + (position.get(l.source) ?? 0), 0) / links.length : 0
				}

				return avg(a) - avg(b)
			})
			layers[d].forEach((id, i) => position.set(id, i))
		}

		for (let d = maxDepth - 1; d >= 0; d--) {
			layers[d].sort((a, b) => {
				const avg = (id: string) => {
					const links = adj.outgoing.get(id) ?? []
					return links.length ? links.reduce((s, l) => s + (position.get(l.target) ?? 0), 0) / links.length : 0
				}

				return avg(a) - avg(b)
			})
			layers[d].forEach((id, i) => position.set(id, i))
		}
	}
}

export const toRechartsFormat = (links: SankeyLink[]) => {
	const nodeIds = [...new Set(links.flatMap((l) => [l.source, l.target]))]
	const adj = buildAdjacency(links)
	const depth = assignDepths(nodeIds, adj)
	const layers = buildLayers(nodeIds, depth)

	barycenterSort(layers, adj)

	const sortedNodes = layers.flat()
	const nodeIndex = new Map<string, number>()
	sortedNodes.forEach((id, i) => nodeIndex.set(id, i))

	const nodes = sortedNodes.map((id) => {
		const inflow = (adj.incoming.get(id) ?? []).reduce((s, l) => s + l.value, 0)
		const outflow = (adj.outgoing.get(id) ?? []).reduce((s, l) => s + l.value, 0)

		return { name: id, count: inflow || outflow }
	})

	const sortedLinks = [...links].sort((a, b) => {
		const srcDiff = (nodeIndex.get(a.source) ?? 0) - (nodeIndex.get(b.source) ?? 0)
		if (srcDiff !== 0) return srcDiff

		return (nodeIndex.get(a.target) ?? 0) - (nodeIndex.get(b.target) ?? 0)
	})

	return {
		nodes,
		links: sortedLinks.map((link) => ({
			source: nodeIndex.get(link.source) ?? 0,
			target: nodeIndex.get(link.target) ?? 0,
			value: link.value,
		})),
	}
}
