'use client'

import { cn, EMPTY_OBJ } from '@/utils'
import type { ReactNode } from 'react'
import { useId } from 'react'
import type { SankeyLinkProps, SankeyNodeProps } from 'recharts'
import { Rectangle, Sankey } from 'recharts'
import type { ChartCssVars, ChartTooltipComponents, ChartTooltipProps, DeriveProps } from '../charts.types'
import { ChartContainer, resolveColor, slotComponents } from '../charts.utils'
import type { ChartTooltipClassNames, ChartTooltipFormatters } from '../ChartTooltip'
import { ChartTooltip } from '../ChartTooltip'
import { toRechartsFormat } from './SankeyChart.utils'

export type SankeyLink = { source: string; target: string; value: number }

export type SankeyClickData =
	| { type: 'link'; source: string; target: string; value: number }
	| { type: 'node'; name: string; value: number }

export type SankeyChartProps = DeriveProps<typeof Sankey, 'data' | 'link' | 'node' | 'onClick'> & {
	disableAnimation?: boolean
	children?: ReactNode
	classNames?: { node?: string; link?: string; tooltip?: ChartTooltipClassNames }
	colors?: string[]
	components?: { tooltip?: boolean | ChartTooltipComponents }
	data: SankeyLink[]
	cssVars?: ChartCssVars
	formatters?: {
		tooltip?: ChartTooltipFormatters
	}
	onDataClick?: (data: SankeyClickData) => void
	subProps?: {
		sankey?: DeriveProps<typeof Sankey, 'data' | 'link' | 'node' | 'onClick'>
	}
}

type Hover = { type: 'link'; el: SVGElement } | { type: 'node'; name: string }

const CASCADE_MS = 250
const CASCADE_TRANSITION = `stroke-dashoffset ${CASCADE_MS}ms linear, stroke-opacity 0.15s`
const cascadeGens = new WeakMap<Element, number>()

const initDash = (el: SVGPathElement | null) => {
	if (!el) return
	const len = el.getTotalLength()
	el.style.strokeDasharray = `${len} ${len}`
	el.style.strokeDashoffset = `${len}`
}

type CascadeCtx = { svg: Element; visited: Set<string>; gen: number; dir: 'backward' | 'forward' }

const brightenNode = (svg: Element, name: string) => {
	for (const n of svg.querySelectorAll<SVGElement>('.recharts-sankey-node'))
		if (n.getAttribute('data-name') === name) n.style.fillOpacity = '1'
}

const cascadeStep = (ctx: CascadeCtx, nodeName: string) => {
	if (cascadeGens.get(ctx.svg) !== ctx.gen || ctx.visited.has(nodeName)) return
	ctx.visited.add(nodeName)
	brightenNode(ctx.svg, nodeName)

	const matchAttr = ctx.dir === 'forward' ? 'data-source' : 'data-target'
	const nextAttr = ctx.dir === 'forward' ? 'data-target' : 'data-source'
	const nexts = new Set<string>()

	for (const el of ctx.svg.querySelectorAll<SVGPathElement>('.sankey-gradient-overlay')) {
		if (el.getAttribute(matchAttr) !== nodeName) continue
		nexts.add(el.getAttribute(nextAttr)!)

		if (ctx.dir === 'backward') {
			el.style.transition = 'none'
			el.style.strokeDashoffset = `${-el.getTotalLength()}`
			void el.getBoundingClientRect()
			el.style.transition = CASCADE_TRANSITION
		}

		el.style.strokeOpacity = '0.5'
		el.style.strokeDashoffset = '0'
	}

	if (nexts.size > 0)
		setTimeout(() => {
			for (const t of nexts) cascadeStep(ctx, t)
		}, CASCADE_MS)
}

const setNodeOpacity = (nodes: NodeListOf<SVGElement>, active: Set<string>, dimmed: string) => {
	for (const n of nodes) n.style.fillOpacity = active.has(n.getAttribute('data-name') ?? '') ? '1' : dimmed
}

const highlight = (svg: Element, hover: Hover | null) => {
	const links = svg.querySelectorAll<SVGElement>('.recharts-sankey-link')
	const nodes = svg.querySelectorAll<SVGElement>('.recharts-sankey-node')

	if (!hover) {
		for (const l of links) l.style.strokeOpacity = ''
		for (const n of nodes) n.style.fillOpacity = ''
		return
	}

	if (hover.type === 'node') {
		const active = new Set<string>([hover.name])

		for (const l of links) {
			const connected = l.getAttribute('data-source') === hover.name || l.getAttribute('data-target') === hover.name
			l.style.strokeOpacity = connected ? '0.75' : ''

			if (connected) {
				active.add(l.getAttribute('data-source')!)
				active.add(l.getAttribute('data-target')!)
			}
		}

		setNodeOpacity(nodes, active, '0.5')
	} else {
		hover.el.style.strokeOpacity = '0.75'
		const active = new Set([hover.el.getAttribute('data-source')!, hover.el.getAttribute('data-target')!])
		setNodeOpacity(nodes, active, '')
	}
}

const handleHover = (e: React.MouseEvent, hover: Hover | null, animate?: boolean) => {
	const svg = (e.currentTarget as Element).closest('svg')
	if (!svg) return

	if (animate) {
		cascadeGens.set(svg, (cascadeGens.get(svg) ?? 0) + 1)

		for (const el of svg.querySelectorAll<SVGPathElement>('.sankey-gradient-overlay')) {
			el.style.transition = 'none'
			el.style.strokeOpacity = '0'
			const len = el.getTotalLength()
			el.style.strokeDasharray = `${len} ${len}`
			el.style.strokeDashoffset = `${len}`
			void el.getBoundingClientRect()
			el.style.transition = CASCADE_TRANSITION
		}
	}

	highlight(svg, hover)

	if (animate && hover?.type === 'node') {
		const gen = cascadeGens.get(svg)!
		cascadeStep({ svg, visited: new Set(), gen, dir: 'forward' }, hover.name)
		cascadeStep({ svg, visited: new Set(), gen, dir: 'backward' }, hover.name)
	}
}

export const SankeyChart = ({
	disableAnimation,
	data,
	children,
	className,
	classNames = EMPTY_OBJ,
	colors,
	components = EMPTY_OBJ,
	cssVars,
	formatters = EMPTY_OBJ,
	onDataClick,
	subProps,
	...chartProps
}: SankeyChartProps) => {
	const animate = !disableAnimation
	const chartId = useId().replace(/:/g, '')
	if (!data || data.length === 0) return null

	const rechartsData = toRechartsFormat(data)

	const nodeColorByName = colors
		? new Map(rechartsData.nodes.map((n, i) => [n.name, resolveColor(i, rechartsData.nodes.length, colors)]))
		: null

	const handleClick =
		onDataClick &&
		((item: SankeyLinkProps | SankeyNodeProps, type: string) => {
			if (type === 'node') {
				const { name, value } = (item as SankeyNodeProps).payload
				onDataClick({ type: 'node', name, value })
			} else {
				const { source, target, value } = (item as SankeyLinkProps).payload
				onDataClick({ type: 'link', source: source.name, target: target.name, value })
			}
		})

	const renderNode = (props: SankeyNodeProps) => {
		const { x, y, width, height, payload } = props
		return (
			<Rectangle
				x={x}
				y={y}
				width={width}
				height={height}
				fill={nodeColorByName ? nodeColorByName.get(payload.name) : 'currentColor'}
				fillOpacity={0.75}
				data-name={payload.name}
				className={cn('recharts-sankey-node stroke-0', classNames.node)}
				style={{ transition: 'fill-opacity 0.2s' }}
				onMouseEnter={(e: React.MouseEvent) => handleHover(e, { type: 'node', name: payload.name }, animate)}
				onMouseLeave={(e: React.MouseEvent) => handleHover(e, null, animate)}
			/>
		)
	}

	const renderLink = (props: SankeyLinkProps) => {
		const { sourceX, targetX, sourceY, targetY, sourceControlX, targetControlX, linkWidth, index, payload } = props
		const sourceName = payload.source.name
		const targetName = payload.target.name
		const gId = nodeColorByName ? `${chartId}g${index}` : undefined
		const pathD = `M${sourceX},${sourceY} C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}`
		const sw = Math.max(1, linkWidth)
		const linkStroke = gId ? `url(#${gId})` : 'currentColor'
		return (
			<>
				{nodeColorByName && (
					<defs>
						<linearGradient id={gId} gradientUnits='userSpaceOnUse' x1={sourceX} y1='0' x2={targetX} y2='0'>
							<stop offset='0%' stopColor={nodeColorByName.get(sourceName)} />
							<stop offset='100%' stopColor={nodeColorByName.get(targetName)} />
						</linearGradient>
					</defs>
				)}
				<path
					d={pathD}
					fill='none'
					stroke={linkStroke}
					strokeWidth={sw}
					strokeOpacity={animate ? 0.15 : 0.5}
					data-source={sourceName}
					data-target={targetName}
					className={cn('recharts-sankey-link', classNames.link)}
					style={{ transition: 'stroke-opacity 0.2s' }}
					onMouseEnter={(e: React.MouseEvent) =>
						handleHover(e, { type: 'link', el: e.currentTarget as SVGElement }, animate)
					}
					onMouseLeave={(e: React.MouseEvent) => handleHover(e, null, animate)}
				/>
				{animate && (
					<path
						ref={initDash}
						d={pathD}
						fill='none'
						stroke={linkStroke}
						strokeWidth={sw}
						strokeOpacity={0}
						data-source={sourceName}
						data-target={targetName}
						className='sankey-gradient-overlay'
						style={{ transition: CASCADE_TRANSITION, pointerEvents: 'none' }}
					/>
				)}
			</>
		)
	}

	return (
		<ChartContainer className={className} cssVars={cssVars}>
			<Sankey
				sort={false}
				align='left'
				className={nodeColorByName ? undefined : 'fill-current stroke-current'}
				node={renderNode}
				link={renderLink}
				{...chartProps}
				{...subProps?.sankey}
				onClick={handleClick}
				data={rechartsData}
			>
				{components.tooltip !== false && (
					<ChartTooltip
						classNames={classNames.tooltip}
						formatters={formatters.tooltip}
						components={slotComponents(components.tooltip)}
						resolve={({ active, payload }: ChartTooltipProps) => {
							if (!active || !payload?.length) return null
							const entry = payload[0]
							const name = entry.name ?? ''
							return {
								// Sankey names use hyphens as source-target separators
								title: name.replaceAll('-', '→'),
								items: [{ key: name, value: entry.value }],
							}
						}}
					/>
				)}
				{children}
			</Sankey>
		</ChartContainer>
	)
}
