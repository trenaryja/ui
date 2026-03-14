import { interpolateColors } from '@/utils'
import type { ChoroplethConfig, GeoLegendItem } from './GeoMap.types'

export const DEFAULT_CHORO_COLORS = ['transparent', 'var(--color-base-content)']

export const getChoroFillFn = ({ data, scaleType = 'quantize', steps = 4, colors, colorSpace }: ChoroplethConfig) => {
	if (!data.length) return () => undefined

	const stops = colors?.length ? colors : DEFAULT_CHORO_COLORS

	const valueMap = new Map(data.map((d) => [d.id, d.value]))
	const values = data.map((d) => d.value).sort((a, b) => a - b)

	const min = values[0]
	const max = values[values.length - 1]
	const span = max - min
	const safeSpan = span || 1
	const safeSteps = Math.max(steps, 1)
	const bucketDiv = Math.max(safeSteps - 1, 1)

	return (id: (typeof data)[number]['id']) => {
		const val = valueMap.get(id)
		if (val == null) return undefined
		if (!span) return interpolateColors(0.5, stops, colorSpace)

		const t =
			scaleType === 'linear'
				? (val - min) / safeSpan
				: scaleType === 'quantize'
					? Math.min(Math.floor(((val - min) / safeSpan) * safeSteps), safeSteps - 1) / bucketDiv
					: (() => {
							const idx = values.findIndex((v) => val <= v) ?? values.length - 1
							const bucket = Math.floor((idx / values.length) * safeSteps)
							return Math.min(bucket, safeSteps - 1) / bucketDiv
						})()

		return interpolateColors(t, stops, colorSpace)
	}
}

export const buildLegendItems = (choropleth: ChoroplethConfig): GeoLegendItem[] => {
	const { data, scaleType = 'quantize', steps = 5, colors, colorSpace, valueFormat } = choropleth
	if (!data.length) return []

	const stops = colors?.length ? colors : DEFAULT_CHORO_COLORS
	const values = data.map((d) => d.value).sort((a, b) => a - b)
	const min = values[0]
	const max = values[values.length - 1]
	const span = max - min
	const safeSteps = Math.max(steps, 1)

	const items: GeoLegendItem[] = []
	const fmt = valueFormat ?? ((v: number) => v.toLocaleString())

	if (scaleType === 'linear') {
		// For linear, produce stops for the gradient endpoints + any intermediate color stops
		items.push({ key: 'min', color: interpolateColors(0, stops, colorSpace), label: fmt(min) })
		items.push({ key: 'max', color: interpolateColors(1, stops, colorSpace), label: fmt(max) })
	} else {
		// Discrete steps for quantize/quantile
		for (let i = 0; i < safeSteps; i++) {
			const t = safeSteps === 1 ? 0.5 : i / (safeSteps - 1)
			const color = interpolateColors(t, stops, colorSpace)

			let label: string

			if (scaleType === 'quantize') {
				const lo = min + (span / safeSteps) * i
				const hi = min + (span / safeSteps) * (i + 1)
				label = valueFormat
					? `${fmt(lo)}–${fmt(hi)}`
					: i === safeSteps - 1
						? `${fmt(Math.round(lo))}–${fmt(Math.round(hi))}`
						: `${fmt(Math.round(lo))}–${fmt(Math.round(hi - 1))}`
			} else {
				// quantile — show the value range for each bucket
				const bucketSize = Math.ceil(values.length / safeSteps)
				const lo = values[Math.min(i * bucketSize, values.length - 1)]
				const hi = values[Math.min((i + 1) * bucketSize - 1, values.length - 1)]
				label = `${fmt(lo)}–${fmt(hi)}`
			}

			items.push({ key: `step-${i}`, color, label })
		}
	}

	return items
}
