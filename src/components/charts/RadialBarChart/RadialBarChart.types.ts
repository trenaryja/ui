import type { PolarChartBaseProps } from '../charts.types'

export type RadialBarChartProps<T extends Record<string, unknown>> = PolarChartBaseProps<T> & {
	valueKey: string & keyof T
	nameKey: string & keyof T
	innerRadius?: number | string
	outerRadius?: number | string
}
