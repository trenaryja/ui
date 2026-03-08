import type { ReactNode } from 'react'
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

export const renderSankeyTooltipContent = ({
	active,
	payload,
}: {
	active?: boolean
	payload?: unknown[]
}): ReactNode | null => {
	if (!active || !payload?.[0]) return null

	const item = (payload[0] as { payload?: unknown }).payload as TooltipPayload

	if (isLinkPayload(item)) {
		const { source, target } = item.payload
		return (
			<div className='stats grid-cols-2 shadow bg-base-200'>
				<div className='stat'>
					<div className='stat-title'>{source.name}</div>
					<div className='stat-value text-lg'>{source.count ?? source.value}</div>
				</div>
				<div className='stat'>
					<div className='stat-title'>{target.name}</div>
					<div className='stat-value text-lg'>{target.count ?? target.value}</div>
				</div>
			</div>
		)
	}

	return (
		<div className='stats shadow bg-base-200'>
			<div className='stat'>
				<div className='stat-title'>{item.name}</div>
				{item.payload?.value !== undefined && <div className='stat-value text-lg'>{item.payload.value}</div>}
			</div>
		</div>
	)
}
