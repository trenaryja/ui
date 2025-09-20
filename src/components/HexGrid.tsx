'use client'

import { Grid, Hex, Orientation, defineHex, rectangle } from 'honeycomb-grid'
import { ReactNode, SVGProps } from 'react'

const longDimensionCount = (px: number, size: number) => Math.ceil((2 * px - size) / (3 * size)) + 1
const shortDimensionCount = (px: number, size: number) => Math.round(px / (Math.sqrt(3) * size)) + 1

export type HexGridProps = {
	center?: 'horizontally' | 'vertically'
	fill?: string
	height?: number
	hexScale?: number
	orientation?: 'flat' | 'pointy'
	sideLength?: number
	stroke?: string
	strokeWidth?: string | number
	styleFn?: (hex: Hex, grid: Grid<Hex>) => SVGProps<SVGPolygonElement>
	svgProps?: SVGProps<SVGSVGElement>
	width?: number
}

export const HexGrid = ({
	center = 'horizontally',
	fill = 'none',
	height,
	hexScale = 10,
	orientation = 'pointy',
	sideLength,
	stroke = 'currentColor',
	strokeWidth = 1,
	styleFn,
	svgProps,
	width,
}: HexGridProps) => {
	const screenWidth = typeof window !== 'undefined' ? window.screen.width * window.devicePixelRatio : 800 // fallback for SSR
	const screenHeight = typeof window !== 'undefined' ? window.screen.height * window.devicePixelRatio : 600 // fallback for SSR

	const finalWidth = width ?? screenWidth
	const finalHeight = height ?? screenHeight

	const sizeCalculations = {
		horizontally: {
			flat: finalWidth / hexScale,
			pointy: finalWidth / hexScale / Math.sqrt(3),
		},
		vertically: {
			flat: finalHeight / hexScale / Math.sqrt(3),
			pointy: finalHeight / hexScale,
		},
	}

	const size = sideLength ?? sizeCalculations[center][orientation]
	const cols = orientation === 'flat' ? longDimensionCount(finalWidth, size) : shortDimensionCount(finalWidth, size)
	const rows = orientation === 'flat' ? shortDimensionCount(finalHeight, size) : longDimensionCount(finalHeight, size)

	const grid = new Grid(
		defineHex({
			dimensions: size,
			orientation: orientation === 'flat' ? Orientation.FLAT : Orientation.POINTY,
		}),
		rectangle({ width: cols, height: rows }),
	)

	return (
		<svg viewBox={`0 0 ${finalWidth} ${finalHeight}`} {...svgProps}>
			{grid.reduce<ReactNode[]>((result, hex) => {
				result.push(
					<polygon
						key={`${hex.x},${hex.y}`}
						fill={fill}
						stroke={stroke}
						strokeWidth={strokeWidth}
						points={hex.corners.map(({ x, y }) => `${x},${y}`).join(' ')}
						{...styleFn?.(hex, grid)}
					/>,
				)
				return result
			}, [])}
		</svg>
	)
}
