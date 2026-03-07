'use client'

import { ResponsiveContainer, Sankey, Tooltip } from 'recharts'
import type { SankeyChartProps, TooltipPayload } from './SankeyChart.types'
import { isLinkPayload, toRechartsFormat } from './SankeyChart.utils'

export type { SankeyChartProps, SankeyData, SankeyLink, SankeyNode } from './SankeyChart.types'

export const SankeyChart = ({ data }: SankeyChartProps) => {
	if (!data || data.nodes.length === 0) return null

	const rechartsData = toRechartsFormat(data)

	return (
		<div className='chart'>
			<ResponsiveContainer width='100%' height='100%' minWidth={0}>
				<Sankey
					data={rechartsData}
					nodePadding={16}
					className='fill-base-content stroke-base-content'
					node={{ fill: 'inherit' }}
					link={{ stroke: 'inherit' }}
				>
					<Tooltip
						content={({ active, payload }) => {
							if (!active || !payload?.[0]) return null

							const item = payload[0].payload as TooltipPayload

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
										{item.payload?.value !== undefined && (
											<div className='stat-value text-lg'>{item.payload.value}</div>
										)}
									</div>
								</div>
							)
						}}
					/>
				</Sankey>
			</ResponsiveContainer>
		</div>
	)
}
