import type { ClassNames } from '@/types'
import type { ReactNode } from 'react'

export type CurveType = 'basis' | 'linear' | 'monotone' | 'natural' | 'step' | 'stepAfter' | 'stepBefore'
export type FillType = 'gradient' | 'none' | 'solid'
export type StackOffset = 'expand' | 'none' | 'positive' | 'sign'

export type CartesianChartClassNames = 'brush' | 'legend' | 'tooltip' | 'xAxis' | 'yAxis'
export type PolarChartClassNames = 'legend' | 'tooltip'

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
export type CartesianTooltipProps = {
	active?: boolean
	payload?: { value: number; dataKey: string; color: string; name: string }[]
	label?: number | string
}

export type PieTooltipProps = {
	active?: boolean
	payload?: { name: string; value: number; fill?: string; payload?: { fill?: string } }[]
}

export type RadarTooltipProps = {
	active?: boolean
	label?: string
	payload?: { name?: string; value?: number; color?: string }[]
}

export type RadialBarTooltipProps = {
	active?: boolean
	payload?: { color?: string; payload?: Record<string, unknown> & { fill?: string } }[]
}

export type SankeyTooltipProps = {
	active?: boolean
	payload?: { payload?: unknown; name: string; value: number }[]
}

export type CartesianChartBaseProps<
	T extends Record<string, unknown>,
	XK extends string & keyof T = string & keyof T,
> = ClassNames<CartesianChartClassNames> & {
	className?: string
	data: T[]
	xKey: XK
	xType?: T[XK] extends number ? 'number' : 'date' | 'string'
	yKey?: string & keyof T
	valueLabel?: string
	yDomain?: [number | 'auto' | 'dataMin', number | 'auto' | 'dataMax']
	yFormat?: (value: number) => string
	xFormat?: (value: string) => string
	referenceLines?: ReferenceLineConfig[]
	referenceAreas?: ReferenceAreaConfig[]
	syncId?: string
	syncMethod?: 'index' | 'value'
	onDataClick?: (data: T, index: number) => void
	brush?: boolean
	brushOptions?: BrushOptions
	legend?: boolean
	tooltip?: boolean
	tooltipContent?: (props: CartesianTooltipProps) => ReactNode
	colors?: string[]
	cssVars?: ChartCssVars
}

export type PolarChartBaseProps<T extends Record<string, unknown>, TP = unknown> = ClassNames<PolarChartClassNames> & {
	className?: string
	data: T[]
	legend?: boolean
	tooltip?: boolean
	tooltipContent?: (props: TP) => ReactNode
	colors?: string[]
	cssVars?: ChartCssVars
}
