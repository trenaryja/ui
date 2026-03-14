import type { ComponentProps, ReactNode, RefObject } from 'react'
import type { Brush, XAxis, YAxis } from 'recharts'
import type { ChartLegendClassNames, ChartLegendFormatters } from './ChartLegend'
import type { ChartTooltipClassNames, ChartTooltipFormatters } from './ChartTooltip'

/** Derive recharts component props, omitting keys we control internally. */
export type DeriveProps<TComponent extends React.ElementType, Controlled extends string = never> = Omit<
	ComponentProps<TComponent>,
	'children' | 'ref' | Controlled
>

export type CartesianSubProps = {
	xAxis?: DeriveProps<typeof XAxis>
	yAxis?: DeriveProps<typeof YAxis>
	brush?: DeriveProps<typeof Brush, 'dataKey'>
}

export type CurveType = 'basis' | 'linear' | 'monotone' | 'natural' | 'step' | 'stepAfter' | 'stepBefore'
export type FillType = 'gradient' | 'none' | 'solid'

export type CartesianChartClassNames = {
	brush?: string
	legend?: ChartLegendClassNames
	tooltip?: ChartTooltipClassNames
	xAxis?: string
	yAxis?: string
}

export type BarChartClassNames = CartesianChartClassNames & {
	bar?: string
}

export type LineChartClassNames = CartesianChartClassNames & {
	area?: string
}

export type RadarChartClassNames = {
	legend?: ChartLegendClassNames
	tooltip?: ChartTooltipClassNames
	polarGrid?: string
	polarAngleAxis?: string
	radar?: string
}

export type PieChartClassNames = {
	legend?: ChartLegendClassNames
	tooltip?: ChartTooltipClassNames
	pie?: string
}

export type RadialBarChartClassNames = {
	legend?: ChartLegendClassNames
	tooltip?: ChartTooltipClassNames
	radialBar?: string
}

export type PolarChartClassNames = {
	legend?: ChartLegendClassNames
	tooltip?: ChartTooltipClassNames
}

export type ChartCssVars = Partial<Record<string, string>>

export type PieChartCssVars = ChartCssVars & Partial<Record<'--chart-pie-gap' | '--chart-pie-stroke', string>>

export type ReferenceLineConfig = {
	y?: number
	x?: number | string
	label?: string
	className?: string
}

export type ReferenceAreaConfig = {
	x1?: number | string
	x2?: number | string
	y1?: number
	y2?: number
	label?: string
	className?: string
}

export type BrushOptions = {
	/** Lock the range axis to the full dataset extent while panning. Prevents rescaling during brush. */
	lockRange?: boolean
}

// Tooltip prop types per chart category
export type ChartTooltipProps<TPayload = unknown> = {
	active?: boolean
	label?: number | string
	payload?: TPayload[]
}

export type CartesianTooltipProps = ChartTooltipProps<{ value: number; dataKey: string; color: string; name: string }>
export type PieTooltipProps = ChartTooltipProps<{
	name: string
	value: number
	fill?: string
	payload?: { fill?: string }
}>
export type RadarTooltipProps = ChartTooltipProps<{ name?: string; value?: number; color?: string }>
export type RadialBarTooltipProps = ChartTooltipProps<{
	value?: number
	color?: string
	payload?: Record<string, unknown> & { fill?: string }
}>
export type SankeyLinkPayload = {
	source: { name: string; count?: number; value: number }
	target: { name: string; count?: number; value: number }
	value: number
}

export type SankeyTooltipProps = ChartTooltipProps<{
	payload: Record<string, unknown>
	name: string
	value: number
}>

export type LegendItem = {
	key: string
	color?: string
	label: string
	value?: ReactNode
	swatch?: ReactNode
}

// Formatter types per chart category
export type CartesianFormatters = {
	domainTick?: (value: number | string) => string
	rangeTick?: (value: number) => string
	tooltip?: ChartTooltipFormatters
	legend?: ChartLegendFormatters
}

export type PolarFormatters = {
	label?: (name: string) => string
	tooltip?: ChartTooltipFormatters
	legend?: ChartLegendFormatters
}

export type SankeyFormatters = {
	tooltip?: ChartTooltipFormatters
	nodeLabel?: (name: string) => string
}

// Shared series base for keyed chart series (Bar, Line, Radar)
export type ChartSeries<TData> = {
	key: string & keyof TData
	color?: string
	label?: string
}

// Shared base for ALL chart types
export type ChartBaseProps<TData extends Record<string, unknown>, TTooltipProps = unknown> = {
	data: TData[]
	/** `true` for default legend, or a render function for custom legend */
	legend?: ((items: LegendItem[]) => ReactNode) | boolean
	/** Portal the legend into a different DOM element */
	legendTarget?: RefObject<HTMLElement | null>
	/** `true` for default tooltip, `false` to disable, or a render function for custom tooltip */
	tooltip?: ((props: TTooltipProps) => ReactNode) | boolean
	colors?: string[]
	cssVars?: ChartCssVars
}

export type CartesianChartBaseProps<
	TData extends Record<string, unknown>,
	TDomainKey extends string & keyof TData = string & keyof TData,
	Chart extends React.ElementType = React.ElementType,
> = ChartBaseProps<TData, CartesianTooltipProps> &
	DeriveProps<Chart, 'data' | 'onClick' | 'stackOffset'> & {
		classNames?: CartesianChartClassNames
		domainKey: TDomainKey
		domainType?: TData[TDomainKey] extends number ? 'number' : 'date' | 'string'
		rangeKey?: string & keyof TData
		valueLabel?: string
		rangeDomain?: [number | 'auto' | 'dataMin', number | 'auto' | 'dataMax']
		formatters?: CartesianFormatters
		referenceLines?: ReferenceLineConfig[]
		referenceAreas?: ReferenceAreaConfig[]
		onDataClick?: (data: TData, index: number) => void
		brush?: boolean
		brushOptions?: BrushOptions
		/** `true` for basic stacking, or a stack offset mode */
		stacked?: boolean | 'expand' | 'positive' | 'sign'
	}

export type PolarChartBaseProps<
	TData extends Record<string, unknown>,
	TTooltipProps = unknown,
	Chart extends React.ElementType = React.ElementType,
> = ChartBaseProps<TData, TTooltipProps> &
	DeriveProps<Chart, 'data'> & {
		classNames?: PolarChartClassNames
		formatters?: PolarFormatters
	}
