'use client'

import { useId, useMemo } from 'react'
import { cn } from '@/utils'
import { DEFAULT_ZERO_COLOR, type ChoroplethConfig, type GeoMapClassNames } from './GeoMap.types'

type ChoroplethLegendProps = {
	viewBox: string
	choropleth: ChoroplethConfig
	classNames?: GeoMapClassNames
}

export const ChoroplethLegend = ({ viewBox, choropleth, classNames }: ChoroplethLegendProps) => {
	const id = useId()
	const {
		data,
		minColor = 'var(--color-base-100)',
		maxColor = 'var(--color-base-content)',
		zeroColor: zeroColorProp,
		legend: { placement = 'bottom-end', vertical = true } = {},
	} = choropleth

	const zeroColor = zeroColorProp === false ? undefined : (zeroColorProp ?? DEFAULT_ZERO_COLOR)

	const [min, max] = useMemo(() => {
		const vals = data.map((d) => d.value)
		return [Math.min(...vals), Math.max(...vals)]
	}, [data])

	const [, , vbW, vbH] = viewBox.split(' ').map(Number)
	if (!vbW || !vbH) return null

	const [direction, flex] = placement.split('-') as [string, string]
	const scale = Math.min(vbW, vbH)
	const padding = scale * 0.025
	const fontSize = scale * 0.025
	const labelGap = fontSize * 1.3
	const barLength = scale * 0.25
	const barThickness = scale * 0.02
	const swatchSize = barThickness
	const swatchGap = scale * 0.015

	const barW = vertical ? barThickness : barLength
	const barH = vertical ? barLength : barThickness

	const zeroBlockH = zeroColor ? (vertical ? swatchGap + swatchSize + labelGap * 1.1 : swatchSize + labelGap) : 0
	const zeroBlockW = zeroColor && !vertical ? swatchSize + swatchGap + fontSize * 3 : 0

	const totalW = vertical ? barW : barW + zeroBlockW
	const totalH = vertical ? labelGap + barH + labelGap + zeroBlockH : barH + labelGap + zeroBlockH

	const x =
		direction === 'left'
			? padding
			: direction === 'right'
				? vbW - totalW - padding
				: flex === 'start'
					? padding
					: flex === 'center'
						? (vbW - totalW) / 2
						: vbW - totalW - padding

	const y =
		direction === 'top'
			? padding
			: direction === 'bottom'
				? vbH - totalH - padding
				: flex === 'start'
					? padding
					: flex === 'center'
						? (vbH - totalH) / 2
						: vbH - totalH - padding

	const barX = x
	const barY = vertical ? y + labelGap : y
	const swatchY = barY + barH + labelGap + swatchGap

	const sharedTextProps = { fontSize, className: 'fill-base-content' }
	const sharedSwatchProps = {
		width: swatchSize,
		height: swatchSize,
		rx: swatchSize / 4,
		fill: zeroColor ?? undefined,
		className: cn('stroke-base-content/25', classNames?.zeroRegion),
		strokeWidth: scale * 0.001,
	}

	const minLabel = vertical
		? { x: barX + barW / 2, y: barY + barH + labelGap * 0.85, textAnchor: 'middle' as const }
		: { x: barX, y: barY + barH + labelGap * 0.85 }

	const maxLabel = vertical
		? { x: barX + barW / 2, y: barY - labelGap * 0.25, textAnchor: 'middle' as const }
		: { x: barX + barW, y: barY + barH + labelGap * 0.85, textAnchor: 'end' as const }

	const zeroSwatch = vertical ? { x: barX + (barW - swatchSize) / 2, y: swatchY } : { x: barX, y: swatchY }

	const zeroLabel = vertical
		? { x: barX + barW / 2, y: swatchY + swatchSize + labelGap, textAnchor: 'middle' as const }
		: { x: barX + swatchSize + swatchGap, y: swatchY + swatchSize * 0.8 }

	return (
		<>
			<defs>
				<linearGradient id={id} x1='0' y1={vertical ? '1' : '0'} x2={vertical ? '0' : '1'} y2='0'>
					<stop offset='0%' stopColor={minColor} />
					<stop offset='100%' stopColor={maxColor} />
				</linearGradient>
			</defs>
			<g className='pointer-events-none'>
				<rect
					x={barX}
					y={barY}
					width={barW}
					height={barH}
					rx={barThickness / 4}
					fill={`url(#${id})`}
					className='stroke-base-content/25'
					strokeWidth={scale * 0.001}
				/>
				<text {...sharedTextProps} {...maxLabel}>
					{max.toLocaleString()}
				</text>
				<text {...sharedTextProps} {...minLabel}>
					{min.toLocaleString()}
				</text>
				{zeroColor && (
					<>
						<rect {...sharedSwatchProps} {...zeroSwatch} />
						<text {...sharedTextProps} {...zeroLabel}>
							0
						</text>
					</>
				)}
			</g>
		</>
	)
}
