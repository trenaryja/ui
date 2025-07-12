import { Grid, Hex, Orientation, defineHex, rectangle } from 'honeycomb-grid'

const screenWidth = window.screen.width * window.devicePixelRatio
const screenHeight = window.screen.height * window.devicePixelRatio

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
	styleFn?: (hex: Hex, grid: Grid<Hex>) => React.SVGProps<SVGPolygonElement>
	svgProps?: React.SVGProps<SVGSVGElement>
	width?: number
}

export const HexGrid = ({
	center = 'horizontally',
	fill = '#000',
	height = screenHeight,
	hexScale = 10,
	orientation = 'pointy',
	sideLength,
	stroke = '#fff',
	strokeWidth = 1,
	styleFn,
	svgProps,
	width = screenWidth,
}: HexGridProps) => {
	const sizeCalculations = {
		horizontally: {
			flat: width / hexScale,
			pointy: width / hexScale / Math.sqrt(3),
		},
		vertically: {
			flat: height / hexScale / Math.sqrt(3),
			pointy: height / hexScale,
		},
	}

	const size = sideLength ?? sizeCalculations[center][orientation]
	const cols = orientation === 'flat' ? longDimensionCount(width, size) : shortDimensionCount(width, size)
	const rows = orientation === 'flat' ? shortDimensionCount(height, size) : longDimensionCount(height, size)

	const grid = new Grid(
		defineHex({
			dimensions: size,
			orientation: orientation === 'flat' ? Orientation.FLAT : Orientation.POINTY,
		}),
		rectangle({ width: cols, height: rows }),
	)

	return (
		<svg viewBox={`0 0 ${width} ${height}`} {...svgProps}>
			{grid.reduce<React.ReactNode[]>((result, hex) => {
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
