import type { CartesianChartBaseProps, CurveType, FillType } from '../charts.types'

export type LineSeries<T> = {
	key: string & keyof T
	label?: string
	fill?: FillType
	curve?: CurveType
	dot?: boolean
	color?: string
	strokeWidth?: number
	strokeDasharray?: string
}

export type LineChartProps<
	T extends Record<string, unknown>,
	XK extends string & keyof T = string & keyof T,
> = CartesianChartBaseProps<T, XK> & {
	series?: LineSeries<T>[]
}
