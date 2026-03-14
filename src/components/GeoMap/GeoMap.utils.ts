import { colorMix } from '@/utils'
import { DEFAULT_ZERO_COLOR, type ChoroplethConfig } from './GeoMap.types'

export const getChoroFillFn = ({
	data,
	scaleType = 'quantize',
	steps = 5,
	minColor = 'var(--color-base-100)',
	maxColor = 'var(--color-base-content)',
	zeroColor,
}: ChoroplethConfig) => {
	if (!data.length) return () => undefined

	const _zeroColor = zeroColor === false ? undefined : (zeroColor ?? DEFAULT_ZERO_COLOR)

	const valueMap = new Map(data.map((d) => [d.id, d.value]))
	const values = data.map((d) => d.value).sort((a, b) => a - b)

	const min = values[0]!
	const max = values[values.length - 1]!
	const span = max - min
	const safeSpan = span || 1
	const safeSteps = Math.max(steps, 1)
	const bucketDiv = Math.max(safeSteps - 1, 1)

	return (id: (typeof data)[number]['id']) => {
		const val = valueMap.get(id)
		if (val == null) return _zeroColor ?? colorMix(maxColor, minColor, 0)
		if (val === 0 && _zeroColor) return _zeroColor
		if (!span) return colorMix(maxColor, minColor, 50)

		const percent =
			scaleType === 'linear'
				? ((val - min) / safeSpan) * 100
				: scaleType === 'quantize'
					? (Math.min(Math.floor(((val - min) / safeSpan) * safeSteps), safeSteps - 1) / bucketDiv) * 100
					: (() => {
							const idx = values.findIndex((v) => val <= v) ?? values.length - 1
							const bucket = Math.floor((idx / values.length) * safeSteps)
							return (Math.min(bucket, safeSteps - 1) / bucketDiv) * 100
						})()

		return colorMix(maxColor, minColor, percent)
	}
}
