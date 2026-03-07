import type { CartesianChartBaseProps, StackOffset } from '../charts.types'

export type BarSeries<T> = {
	key: string & keyof T
	label?: string
	stackId?: string
	color?: string
	radius?: number
}

export type BarChartProps<
	T extends Record<string, unknown>,
	XK extends string & keyof T = string & keyof T,
> = CartesianChartBaseProps<T, XK> & {
	series?: BarSeries<T>[]
	layout?: 'horizontal' | 'vertical'
	stacked?: boolean
	stackOffset?: StackOffset
	barSize?: number
	barCategoryGap?: number | string
}
