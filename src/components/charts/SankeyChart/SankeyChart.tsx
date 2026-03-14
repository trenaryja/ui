'use client'

import { EMPTY_OBJ } from '@/utils'
import type { ReactNode } from 'react'
import { Sankey } from 'recharts'
import type { ChartCssVars, ChartTooltipComponents, ChartTooltipProps, DeriveProps } from '../charts.types'
import { ChartContainer, slotComponents } from '../charts.utils'
import type { ChartTooltipClassNames, ChartTooltipFormatters } from '../ChartTooltip'
import { ChartTooltip } from '../ChartTooltip'
import { toRechartsFormat } from './SankeyChart.utils'

export type SankeyLink = { source: string; target: string; value: number }

export type SankeyChartProps = DeriveProps<typeof Sankey, 'data' | 'link' | 'node'> & {
	children?: ReactNode
	classNames?: { tooltip?: ChartTooltipClassNames }
	components?: { tooltip?: boolean | ChartTooltipComponents }
	data: SankeyLink[]
	cssVars?: ChartCssVars
	formatters?: {
		tooltip?: ChartTooltipFormatters
	}
}

export const SankeyChart = ({
	data,
	children,
	className,
	classNames = EMPTY_OBJ,
	components = EMPTY_OBJ,
	cssVars,
	formatters = EMPTY_OBJ,
	...chartProps
}: SankeyChartProps) => {
	if (!data || data.length === 0) return null

	return (
		<ChartContainer className={className} cssVars={cssVars}>
			<Sankey
				sort={false}
				align='left'
				className='fill-current stroke-current'
				node={{ className: 'fill-inherit [fill-opacity:1]' }}
				link={{ className: 'stroke-inherit hover:[stroke-opacity:.5]' }}
				{...chartProps}
				data={toRechartsFormat(data)}
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
