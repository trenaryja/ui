import type { FillType, PolarChartBaseProps } from '../charts.types'

export type RadarSeries<T> = {
	key: string & keyof T
	label?: string
	fill?: FillType
	color?: string
}

export type RadarChartProps<T extends Record<string, unknown>> = PolarChartBaseProps<T> & {
	angleKey: string & keyof T
	yKey?: string & keyof T
	series?: RadarSeries<T>[]
	gridType?: 'circle' | 'polygon'
}
