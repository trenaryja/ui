// Public types
export type SankeyNode = {
	id: string
	value: number
}

export type SankeyLink = {
	source: string
	target: string
	value: number
}

export type SankeyData = {
	nodes: SankeyNode[]
	links: SankeyLink[]
}

export type SankeyChartProps = {
	data: SankeyData
	emptyMessage?: string
}

// Internal Recharts types
export type RechartsSankeyNode = {
	name: string
	count?: number
}

export type RechartsSankeyLink = {
	source: number
	target: number
	value: number
}

export type RechartsSankeyData = {
	nodes: RechartsSankeyNode[]
	links: RechartsSankeyLink[]
}

export type ResolvedLink = {
	source: RechartsSankeyNode & { value: number }
	target: RechartsSankeyNode & { value: number }
	value: number
}

export type TooltipPayload = {
	payload?: ResolvedLink
	name: string
	value: number
	count?: number
}
