import type { ChartCssVars } from '../charts.utils'
import type { PolarChartBaseProps } from '../charts.types'

export type PieSeries<T> = {
	valueKey: string & keyof T
	nameKey: string & keyof T
	innerRadius?: number | string
	outerRadius?: number | string
	cornerRadius?: number
	paddingAngle?: number
}

export type PieChartProps<T extends Record<string, unknown>> = PolarChartBaseProps<T> & {
	valueKey?: string & keyof T
	nameKey?: string & keyof T
	innerRadius?: number | string
	outerRadius?: number | string
	cornerRadius?: number
	paddingAngle?: number
	series?: PieSeries<T>[]
	startAngle?: number
	endAngle?: number
	donut?: boolean
	noGap?: boolean
	monotone?: boolean
	cssVars?: ChartCssVars
}
