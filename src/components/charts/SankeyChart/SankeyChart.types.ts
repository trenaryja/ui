import type { ReactNode } from 'react'
import type { ChartCssVars, SankeyTooltipProps } from '../charts.types'

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
	className?: string
	classNames?: { tooltip?: string }
	data: SankeyData
	tooltip?: boolean
	tooltipContent?: (props: SankeyTooltipProps) => ReactNode
	cssVars?: ChartCssVars
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
