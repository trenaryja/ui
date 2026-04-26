export type Hex = { q: number; r: number }
export type HexPoint = { x: number; y: number }
export type HexOrientation = 'flat' | 'pointy'

const SQRT3 = Math.sqrt(3)
const SQRT3_HALF = SQRT3 / 2

// Ring-traversal step directions (axial). Starting from east, going clockwise.
const RING_DIRECTIONS: readonly Hex[] = [
	{ q: -1, r: 1 },
	{ q: -1, r: 0 },
	{ q: 0, r: -1 },
	{ q: 1, r: -1 },
	{ q: 1, r: 0 },
	{ q: 0, r: 1 },
]

/** Axial distance between two hexes (defaults b to origin). */
export const hexDistance = (a: Hex, b: Hex = { q: 0, r: 0 }) => {
	const dq = a.q - b.q
	const dr = a.r - b.r
	return (Math.abs(dq) + Math.abs(dq + dr) + Math.abs(dr)) / 2
}

/** Pixel center of a hex cell. */
export const hexToPixel = ({ q, r }: Hex, size: number, orientation: HexOrientation): HexPoint =>
	orientation === 'flat'
		? { x: size * 1.5 * q, y: size * (SQRT3_HALF * q + SQRT3 * r) }
		: { x: size * (SQRT3 * q + SQRT3_HALF * r), y: size * 1.5 * r }

/** 6 vertex points of a hex polygon. */
export const hexCorners = (center: HexPoint, size: number, orientation: HexOrientation): HexPoint[] => {
	const startAngle = orientation === 'flat' ? 0 : Math.PI / 6
	return Array.from({ length: 6 }, (_, i) => {
		const angle = startAngle + (Math.PI / 3) * i
		return { x: center.x + size * Math.cos(angle), y: center.y + size * Math.sin(angle) }
	})
}

/** SVG `points` attribute string for a hex polygon. */
export const hexToSvgPoints = (hex: Hex, size: number, orientation: HexOrientation): string =>
	hexCorners(hexToPixel(hex, size, orientation), size, orientation)
		.map(({ x, y }) => `${x},${y}`)
		.join(' ')

/** All hexes in ring N. Ring 0 → just the center. Ring N → 6N cells. */
export const hexRing = (radius: number): Hex[] => {
	if (radius === 0) return [{ q: 0, r: 0 }]
	const results: Hex[] = []
	let { q, r } = { q: radius, r: 0 }

	for (let side = 0; side < 6; side++) {
		const dir = RING_DIRECTIONS[side]

		for (let step = 0; step < radius; step++) {
			results.push({ q, r })
			q += dir.q
			r += dir.r
		}
	}

	return results
}

/** All hexes from center through ring N (full disk). Total cells: 3N² + 3N + 1. */
export const hexDisk = (rings: number): Hex[] => Array.from({ length: rings + 1 }, (_, i) => hexRing(i)).flat()

/** Angle in degrees (0–360) of a hex from the origin. Used for hue mapping. */
export const hexAngle = (hex: Hex, orientation: HexOrientation): number => {
	if (hex.q === 0 && hex.r === 0) return 0
	const { x, y } = hexToPixel(hex, 1, orientation)
	return (Math.atan2(y, x) * (180 / Math.PI) + 360) % 360
}

/** Tight axis-aligned bounding box of a hex disk. Adds `padding` on each side. */
export const hexDiskBounds = (rings: number, size: number, opts: { orientation: HexOrientation; padding?: number }) => {
	const { orientation, padding = 0 } = opts
	let maxX = -Infinity
	let maxY = -Infinity
	let minX = Infinity
	let minY = Infinity

	for (const hex of hexDisk(rings))
		for (const { x, y } of hexCorners(hexToPixel(hex, size, orientation), size, orientation)) {
			if (x < minX) minX = x
			if (y < minY) minY = y
			if (x > maxX) maxX = x
			if (y > maxY) maxY = y
		}

	return {
		minX: minX - padding,
		minY: minY - padding,
		width: maxX - minX + padding * 2,
		height: maxY - minY + padding * 2,
	}
}
