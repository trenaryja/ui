import type { RechartsSankeyData, RechartsSankeyNode, SankeyData, TooltipPayload } from './SankeyChart.types'

export const toRechartsFormat = (data: SankeyData): RechartsSankeyData => {
	const nodeMap = new Map<string, number>()
	let index = 0

	for (const node of data.nodes) {
		nodeMap.set(node.id, index)
		index += 1
	}

	const nodes: RechartsSankeyNode[] = data.nodes.map((node) => ({
		name: node.id,
		count: node.value,
	}))

	const links = data.links.map((link) => ({
		source: nodeMap.get(link.source) ?? 0,
		target: nodeMap.get(link.target) ?? 0,
		value: link.value,
	}))

	return { nodes, links }
}

export const isLinkPayload = (
	item: TooltipPayload,
): item is TooltipPayload & { payload: NonNullable<TooltipPayload['payload']> } =>
	item.payload !== undefined && 'source' in item.payload && 'target' in item.payload
