import type { ClassNames } from '@/types'
import type { ReactNode } from 'react'

export type CurveType = 'basis' | 'linear' | 'monotone' | 'natural' | 'step' | 'stepAfter' | 'stepBefore'
export type FillType = 'gradient' | 'none' | 'solid'
export type StackOffset = 'expand' | 'none' | 'positive' | 'sign'

export type CartesianChartClassNames = 'brush' | 'container' | 'legend' | 'tooltip' | 'xAxis' | 'yAxis'
export type NonCartesianChartClassNames = 'container' | 'legend' | 'tooltip'

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

export type CartesianChartBaseProps<
	T extends Record<string, unknown>,
	XK extends string & keyof T = string & keyof T,
> = ClassNames<CartesianChartClassNames> & {
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
	tooltip?: ((props: unknown) => ReactNode) | boolean
	emptyMessage?: string
}

export type PolarChartBaseProps<T extends Record<string, unknown>> = ClassNames<NonCartesianChartClassNames> & {
	data: T[]
	legend?: boolean
	tooltip?: ((props: unknown) => ReactNode) | boolean
	emptyMessage?: string
}
