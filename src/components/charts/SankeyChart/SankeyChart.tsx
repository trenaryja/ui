'use client'

import type { ReactNode } from 'react'
import { Sankey } from 'recharts'
import type { ChartCssVars, DeriveProps, SankeyFormatters, SankeyTooltipProps } from '../charts.types'
import { ChartContainer } from '../charts.utils'
import type { ChartTooltipClassNames } from '../ChartTooltip'
import { ChartTooltip } from '../ChartTooltip'
import { toRechartsFormat } from './SankeyChart.utils'

export type SankeyLink = { source: string; target: string; value: number }

export type SankeyChartProps = DeriveProps<typeof Sankey, 'data' | 'link' | 'node'> & {
	classNames?: { tooltip?: ChartTooltipClassNames }
	data: SankeyLink[]
	tooltip?: ((props: SankeyTooltipProps) => ReactNode) | boolean
	formatters?: SankeyFormatters
	cssVars?: ChartCssVars
}

export const SankeyChart = ({
	data,
	className,
	classNames,
	cssVars,
	tooltip = true,
	formatters,
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
				<ChartTooltip
					tooltip={tooltip}
					classNames={classNames?.tooltip}
					formatters={formatters?.tooltip}
					resolve={({ active, payload }: SankeyTooltipProps) => {
						if (!active || !payload?.length) return null
						const entry = payload[0]
						return {
							title: entry.name.replace('-', '→'),
							items: [{ key: entry.name, value: entry.value }],
						}
					}}
				/>
			</Sankey>
		</ChartContainer>
	)
}
