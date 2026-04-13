import type { ComponentProps, ComponentType, ReactNode, RefObject } from 'react'
import type { Brush, CartesianGrid, XAxis, YAxis } from 'recharts'
import type { ChartLegendClassNames, ChartLegendFormatters } from './ChartLegend'
import type { ChartTooltipClassNames, ChartTooltipFormatters, TooltipData, TooltipItem } from './ChartTooltip'

/** Derive recharts component props, omitting keys we control internally. */
export type DeriveProps<TComponent extends React.ElementType, Controlled extends string = never> = Omit<
	ComponentProps<TComponent>,
	'children' | 'ref' | Controlled
>

export type CartesianSubProps = {
	grid?: DeriveProps<typeof CartesianGrid>
	xAxis?: DeriveProps<typeof XAxis>
	yAxis?: DeriveProps<typeof YAxis>
	brush?: DeriveProps<typeof Brush, 'dataKey'>
}

export type CurveType = 'basis' | 'linear' | 'monotone' | 'natural' | 'step' | 'stepAfter' | 'stepBefore'
export type FillType = 'gradient' | 'none' | 'solid'

export type BaseChartClassNames = {
	legend?: ChartLegendClassNames
	tooltip?: ChartTooltipClassNames
}
export type CartesianChartClassNames = {
	brush?: string
	grid?: string
	xAxis?: string
	yAxis?: string
}

export type BaseChartFormatters = {
	tooltip?: ChartTooltipFormatters
	legend?: ChartLegendFormatters
}
export type CartesianFormatters = {
	domainTick?: (value: number | string) => string
	rangeTick?: (value: number) => string
}
export type PolarFormatters = {
	label?: (name: string) => string
}

/** CSS custom properties defined in the `.chart` utility class */
export const chartCssVars = ['--chart-pie-gap', '--chart-pie-stroke'] as const
export type ChartCssVars = Partial<Record<(typeof chartCssVars)[number], string>>

export type ChartTooltipProps = {
	active?: boolean
	label?: number | string
	payload?: {
		name?: string
		value?: number
		color?: string
		fill?: string
		dataKey?: string
		payload?: Record<string, unknown> & { fill?: string }
	}[]
}

export type LegendItem = {
	key: string
	color?: string
	label: string
	value?: ReactNode
	swatch?: ReactNode
}

// Shared series base for keyed chart series (Bar, Line, Radar)
export type ChartSeries<TData> = {
	key: string & keyof TData
	color?: string
	label?: string
}

// Component slot types — union: function = full replacement, object = partial slot overrides
export type ChartTooltipComponents =
	| ComponentType<{ data: TooltipData | null; raw: ChartTooltipProps }>
	| {
			container?: ComponentType<{ data: TooltipData; className?: string; children: ReactNode }>
			title?: ComponentType<{ data: TooltipData; className?: string }>
			row?: ComponentType<{ item: TooltipItem; className?: string; children: ReactNode }>
			swatch?: ComponentType<{ item: TooltipItem; className?: string }>
	  }

export type ChartLegendComponents =
	| ComponentType<{ items: LegendItem[] }>
	| {
			container?: ComponentType<{ items: LegendItem[]; className?: string; children: ReactNode }>
			item?: ComponentType<{ item: LegendItem; className?: string; children: ReactNode }>
			swatch?: ComponentType<{ item: LegendItem; className?: string }>
	  }

// Shared base for ALL chart types
export type ChartBaseProps<TData extends Record<string, unknown>> = {
	children?: ReactNode
	data: TData[]
	/** Portal the legend into a different DOM element */
	legendTarget?: RefObject<HTMLElement | null>
	colors?: string[]
	cssVars?: ChartCssVars
	classNames?: BaseChartClassNames
	components?: {
		tooltip?: boolean | ChartTooltipComponents
		legend?: boolean | ChartLegendComponents
	}
	formatters?: BaseChartFormatters
}

export type CartesianChartBaseProps<
	TData extends Record<string, unknown>,
	TDomainKey extends string & keyof TData = string & keyof TData,
	Chart extends React.ElementType = React.ElementType,
> = ChartBaseProps<TData> &
	DeriveProps<Chart, 'data' | 'onClick' | 'stackOffset'> & {
		classNames?: CartesianChartClassNames
		components?: {
			grid?: true
			xAxis?: false
			yAxis?: false
			brush?: true
		}
		domainKey: TDomainKey
		domainType?: TData[TDomainKey] extends number ? 'number' : 'date' | 'string'
		rangeKey?: string & keyof TData
		valueLabel?: string
		rangeDomain?: [number | 'auto' | 'dataMin', number | 'auto' | 'dataMax']
		formatters?: CartesianFormatters
		onDataClick?: (data: TData, index: number) => void
		brushOptions?: {
			/** Lock the range axis to the full dataset extent while panning. Prevents rescaling during brush. */
			lockRange?: boolean
		}
		/** `true` for basic stacking, or a stack offset mode */
		stacked?: boolean | 'expand' | 'positive' | 'sign'
	}

export type PolarChartBaseProps<
	TData extends Record<string, unknown>,
	Chart extends React.ElementType = React.ElementType,
> = ChartBaseProps<TData> &
	DeriveProps<Chart, 'data'> & {
		formatters?: PolarFormatters
	}
