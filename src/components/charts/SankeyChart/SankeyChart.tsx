'use client'

import { Sankey, Tooltip } from 'recharts'
import { ChartContainer } from '../charts.utils'
import { ChartTooltip } from '../ChartTooltip'
import type { SankeyChartProps, TooltipPayload } from './SankeyChart.types'
import { renderSankeyTooltipContent, toRechartsFormat } from './SankeyChart.utils'

export type { SankeyChartProps, SankeyData, SankeyLink, SankeyNode } from './SankeyChart.types'

export const SankeyChart = ({
	data,
	className,
	classNames,
	cssVars,
	tooltip = true,
	tooltipContent,
}: SankeyChartProps) => {
	if (!data || data.nodes.length === 0) return null

	const rechartsData = toRechartsFormat(data)

	return (
		<ChartContainer className={className} cssVars={cssVars}>
			<Sankey
				data={rechartsData}
				nodePadding={16}
				className='fill-base-content stroke-base-content'
				node={{ fill: 'inherit' }}
				link={{ stroke: 'inherit' }}
			>
				{tooltip && (
					<Tooltip
						wrapperStyle={{ display: 'none' }}
						content={({ active, payload }) => (
							<ChartTooltip active={active} className={classNames?.tooltip}>
								{tooltipContent
									? tooltipContent({ active, payload: payload as unknown as TooltipPayload[] })
									: renderSankeyTooltipContent({ active, payload: payload as unknown[] })}
							</ChartTooltip>
						)}
					/>
				)}
			</Sankey>
		</ChartContainer>
	)
}
