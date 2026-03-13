import type { ComponentProps, ReactNode, RefObject } from 'react'
import type { Brush, XAxis, YAxis } from 'recharts'
import type { ChartLegendClassNames } from './ChartLegend'
import type { ChartTooltipClassNames } from './ChartTooltip'

/** Derive recharts component props, omitting keys we control internally. */
export type DeriveProps<C extends React.ElementType, Controlled extends string = never> = Omit<
	ComponentProps<C>,
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
	/** Lock the Y-axis to the full dataset range while panning. Prevents rescaling during brush. */
	lockYAxis?: boolean
}

// Tooltip prop types per chart category
export type ChartTooltipProps<P = unknown> = {
	active?: boolean
	label?: number | string
	payload?: P[]
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

// Shared series base for keyed chart series (Bar, Line, Radar)
export type ChartSeries<T> = {
	key: string & keyof T
	color?: string
	label?: string
}

// Shared base for ALL chart types
export type ChartBaseProps<T extends Record<string, unknown>, TP = unknown> = {
	data: T[]
	/** `true` for default legend, or a render function for custom legend */
	legend?: ((items: LegendItem[]) => ReactNode) | boolean
	/** Portal the legend into a different DOM element */
	legendTarget?: RefObject<HTMLElement | null>
	/** `true` for default tooltip, `false` to disable, or a render function for custom tooltip */
	tooltip?: ((props: TP) => ReactNode) | boolean
	colors?: string[]
	cssVars?: ChartCssVars
}

export type CartesianChartBaseProps<
	T extends Record<string, unknown>,
	XK extends string & keyof T = string & keyof T,
	Chart extends React.ElementType = React.ElementType,
> = ChartBaseProps<T, CartesianTooltipProps> &
	DeriveProps<Chart, 'data' | 'onClick' | 'stackOffset'> & {
		classNames?: CartesianChartClassNames
		xKey: XK
		xType?: T[XK] extends number ? 'number' : 'date' | 'string'
		yKey?: string & keyof T
		valueLabel?: string
		yDomain?: [number | 'auto' | 'dataMin', number | 'auto' | 'dataMax']
		yFormat?: (value: number) => string
		xFormat?: (value: string) => string
		referenceLines?: ReferenceLineConfig[]
		referenceAreas?: ReferenceAreaConfig[]
		onDataClick?: (data: T, index: number) => void
		brush?: boolean
		brushOptions?: BrushOptions
		/** `true` for basic stacking, or a stack offset mode */
		stacked?: boolean | 'expand' | 'positive' | 'sign'
	}

export type PolarChartBaseProps<
	T extends Record<string, unknown>,
	TP = unknown,
	Chart extends React.ElementType = React.ElementType,
> = ChartBaseProps<T, TP> &
	DeriveProps<Chart, 'data'> & {
		classNames?: PolarChartClassNames
	}
