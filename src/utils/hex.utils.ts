export type HexPoint = { x: number; y: number }
export type Hex = { q: number; r: number }
export type HexGridCoord = { col: number; row: number }
export type HexOrientation = 'flat' | 'pointy'
export type HexLayout = { orientation: HexOrientation; size: number | HexPoint; origin?: HexPoint }
export type HexRange = { center: Hex; radius: number }

const SQRT3 = Math.sqrt(3)
const SQRT3_2 = SQRT3 / 2
const SQRT3_3 = SQRT3 / 3

export const HEX_ORIGIN: Hex = { q: 0, r: 0 }

export const HEX_DIRECTIONS: readonly Hex[] = [
	{ q: 1, r: 0 },
	{ q: 1, r: -1 },
	{ q: 0, r: -1 },
	{ q: -1, r: 0 },
	{ q: -1, r: 1 },
	{ q: 0, r: 1 },
]

export const HEX_DIAGONALS: readonly Hex[] = [
	{ q: 2, r: -1 },
	{ q: 1, r: -2 },
	{ q: -1, r: -1 },
	{ q: -2, r: 1 },
	{ q: -1, r: 2 },
	{ q: 1, r: 1 },
]

export const hexAdd = (a: Hex, b: Hex): Hex => ({ q: a.q + b.q, r: a.r + b.r })
export const hexSubtract = (a: Hex, b: Hex): Hex => ({ q: a.q - b.q, r: a.r - b.r })
export const hexScale = (h: Hex, k: number): Hex => ({ q: h.q * k, r: h.r * k })
export const hexEquals = (a: Hex, b: Hex) => a.q === b.q && a.r === b.r

export const hexLength = ({ q, r }: Hex) => (Math.abs(q) + Math.abs(q + r) + Math.abs(r)) / 2

export const hexDistance = (a: Hex, b: Hex) => {
	const dq = a.q - b.q
	const dr = a.r - b.r
	return (Math.abs(dq) + Math.abs(dq + dr) + Math.abs(dr)) / 2
}

export const hexEuclideanDistance = (a: Hex, b: Hex) => {
	const dq = a.q - b.q
	const dr = a.r - b.r
	return Math.sqrt(dq * dq + dr * dr + dq * dr)
}

export const hexNeighbor = (hex: Hex, dir: number): Hex => hexAdd(hex, HEX_DIRECTIONS[((dir % 6) + 6) % 6])

export const hexDiagonalNeighbor = (hex: Hex, dir: number): Hex => hexAdd(hex, HEX_DIAGONALS[((dir % 6) + 6) % 6])

export const hexLerp = (a: Hex, b: Hex, t: number): Hex => ({
	q: a.q * (1 - t) + b.q * t,
	r: a.r * (1 - t) + b.r * t,
})

export const hexRound = ({ q, r }: Hex): Hex => {
	let qi = Math.round(q)
	let ri = Math.round(r)
	const si = Math.round(-q - r)
	const qdiff = Math.abs(qi - q)
	const rdiff = Math.abs(ri - r)
	const sdiff = Math.abs(si - (-q - r))
	if (qdiff > rdiff && qdiff > sdiff) qi = -ri - si
	else if (rdiff > sdiff) ri = -qi - si
	return { q: qi, r: ri }
}

export const hexRotateRight = ({ q, r }: Hex): Hex => ({ q: -r, r: q + r })
export const hexRotateLeft = ({ q, r }: Hex): Hex => ({ q: q + r, r: -q })

export const hexRotateAround = (hex: Hex, center: Hex, steps: number): Hex => {
	const normalized = ((steps % 6) + 6) % 6
	let vec = hexSubtract(hex, center)
	for (let i = 0; i < normalized; i++) vec = hexRotateRight(vec)
	return hexAdd(vec, center)
}

export const hexReflectQ = ({ q, r }: Hex): Hex => ({ q, r: -q - r })
export const hexReflectR = ({ q, r }: Hex): Hex => ({ q: -q - r, r })
export const hexReflectS = ({ q, r }: Hex): Hex => ({ q: r, r: q })

const toPoint = (size: number | HexPoint): HexPoint => (typeof size === 'number' ? { x: size, y: size } : size)

export const hexToPixel = ({ q, r }: Hex, { orientation, size, origin }: HexLayout): HexPoint => {
	const { x: sx, y: sy } = toPoint(size)
	const ox = origin?.x ?? 0
	const oy = origin?.y ?? 0
	return orientation === 'flat'
		? { x: sx * 1.5 * q + ox, y: sy * (SQRT3_2 * q + SQRT3 * r) + oy }
		: { x: sx * (SQRT3 * q + SQRT3_2 * r) + ox, y: sy * 1.5 * r + oy }
}

export const pointToHex = ({ x, y }: HexPoint, { orientation, size, origin }: HexLayout): Hex => {
	const { x: sx, y: sy } = toPoint(size)
	const px = (x - (origin?.x ?? 0)) / sx
	const py = (y - (origin?.y ?? 0)) / sy
	return hexRound(
		orientation === 'flat'
			? { q: (2 / 3) * px, r: (-1 / 3) * px + SQRT3_3 * py }
			: { q: SQRT3_3 * px - (1 / 3) * py, r: (2 / 3) * py },
	)
}

export const hexCorners = (hex: Hex, layout: HexLayout): HexPoint[] => {
	const { x: sx, y: sy } = toPoint(layout.size)
	const flat = layout.orientation === 'flat'
	const ox = layout.origin?.x ?? 0
	const oy = layout.origin?.y ?? 0
	const cx = flat ? sx * 1.5 * hex.q + ox : sx * (SQRT3 * hex.q + SQRT3_2 * hex.r) + ox
	const cy = flat ? sy * (SQRT3_2 * hex.q + SQRT3 * hex.r) + oy : sy * 1.5 * hex.r + oy
	const startAngle = flat ? 0 : Math.PI / 6
	return Array.from({ length: 6 }, (_, i) => ({
		x: cx + sx * Math.cos(startAngle + (Math.PI / 3) * i),
		y: cy + sy * Math.sin(startAngle + (Math.PI / 3) * i),
	}))
}

export const hexToSvgPoints = (hex: Hex, layout: HexLayout): string =>
	hexCorners(hex, layout)
		.map(({ x, y }) => `${x},${y}`)
		.join(' ')

export const hexRingAt = (center: Hex, radius: number): Hex[] => {
	if (radius === 0) return [center]
	const results = new Array<Hex>(6 * radius)
	let idx = 0
	let hex = hexAdd(center, hexScale(HEX_DIRECTIONS[4], radius))

	for (let side = 0; side < 6; side++) {
		const { q: dq, r: dr } = HEX_DIRECTIONS[side]

		for (let step = 0; step < radius; step++) {
			results[idx++] = hex
			hex = { q: hex.q + dq, r: hex.r + dr }
		}
	}

	return results
}

export const hexSpiralAt = (center: Hex, radius: number): Hex[] => {
	const result = new Array<Hex>(1 + 3 * radius * (radius + 1))
	result[0] = center
	let idx = 1
	for (let ring = 1; ring <= radius; ring++) for (const hex of hexRingAt(center, ring)) result[idx++] = hex
	return result
}

export const hexLine = (a: Hex, b: Hex): Hex[] => {
	const n = hexDistance(a, b)
	const denom = Math.max(n, 1)
	const aN: Hex = { q: a.q + 1e-6, r: a.r + 1e-6 }
	const bN: Hex = { q: b.q + 1e-6, r: b.r + 1e-6 }
	return Array.from({ length: n + 1 }, (_, i) => hexRound(hexLerp(aN, bN, i / denom)))
}

export const hexRange = (center: Hex, radius: number): Hex[] => {
	const result = new Array<Hex>(1 + 3 * radius * (radius + 1))
	let idx = 0
	for (let q = -radius; q <= radius; q++)
		for (let r = Math.max(-radius, -q - radius); r <= Math.min(radius, -q + radius); r++)
			result[idx++] = { q: center.q + q, r: center.r + r }
	return result
}

export const hexRangeIntersect = (a: HexRange, b: HexRange): Hex[] => {
	const { center: centerA, radius: radiusA } = a
	const { center: centerB, radius: radiusB } = b
	const qMin = Math.max(centerA.q - radiusA, centerB.q - radiusB)
	const qMax = Math.min(centerA.q + radiusA, centerB.q + radiusB)
	const rMin = Math.max(centerA.r - radiusA, centerB.r - radiusB)
	const rMax = Math.min(centerA.r + radiusA, centerB.r + radiusB)
	const sMin = Math.max(-centerA.q - centerA.r - radiusA, -centerB.q - centerB.r - radiusB)
	const sMax = Math.min(-centerA.q - centerA.r + radiusA, -centerB.q - centerB.r + radiusB)
	const result: Hex[] = []
	for (let q = qMin; q <= qMax; q++)
		for (let r = Math.max(rMin, -q - sMax); r <= Math.min(rMax, -q - sMin); r++) result.push({ q, r })
	return result
}

export const hexFloodFill = (start: Hex, maxDist: number, isBlocked: (hex: Hex) => boolean): Hex[] => {
	const visited = new Map<string, Hex>([[`${start.q},${start.r}`, start]])
	let frontier = [start]

	for (let k = 0; k < maxDist && frontier.length > 0; k++) {
		const next: Hex[] = []

		for (const hex of frontier)
			for (let dir = 0; dir < 6; dir++) {
				const { q: dq, r: dr } = HEX_DIRECTIONS[dir]
				const nb: Hex = { q: hex.q + dq, r: hex.r + dr }
				const key = `${nb.q},${nb.r}`

				if (!visited.has(key) && !isBlocked(nb)) {
					visited.set(key, nb)
					next.push(nb)
				}
			}

		frontier = next
	}

	return [...visited.values()]
}

export const hexParallelogram = (from: Hex, to: Hex): Hex[] => {
	const result: Hex[] = []
	for (let { q } = from; q <= to.q; q++) for (let { r } = from; r <= to.r; r++) result.push({ q, r })
	return result
}

export const hexTriangle = (size: number, direction: 'north' | 'south'): Hex[] => {
	const result: Hex[] = []
	const south = direction === 'south'
	for (let q = 0; q <= size; q++)
		for (let r = south ? 0 : size - q; r <= (south ? size - q : size); r++) result.push({ q, r })
	return result
}

export const hexRectangle = (width: number, height: number, orientation: HexOrientation): Hex[] => {
	const result: Hex[] = []

	if (orientation === 'pointy')
		for (let r = 0; r < height; r++) {
			const offset = Math.floor(r / 2)
			for (let q = -offset; q < width - offset; q++) result.push({ q, r })
		}
	else
		for (let q = 0; q < width; q++) {
			const offset = Math.floor(q / 2)
			for (let r = -offset; r < height - offset; r++) result.push({ q, r })
		}

	return result
}

export const rOffsetToCube = (col: number, row: number, offset: -1 | 1 = 1): Hex => ({
	q: col - (row + offset * (row & 1)) / 2,
	r: row,
})

export const cubeToROffset = ({ q, r }: Hex, offset: -1 | 1 = 1): HexGridCoord => ({
	col: q + (r + offset * (r & 1)) / 2,
	row: r,
})

export const qOffsetToCube = (col: number, row: number, offset: -1 | 1 = 1): Hex => ({
	q: col,
	r: row - (col + offset * (col & 1)) / 2,
})

export const cubeToQOffset = ({ q, r }: Hex, offset: -1 | 1 = 1): HexGridCoord => ({
	col: q,
	row: r + (q + offset * (q & 1)) / 2,
})

export const qdoubledToCube = ({ col, row }: HexGridCoord): Hex => ({ q: col, r: (row - col) / 2 })
export const cubeToQdoubled = ({ q, r }: Hex): HexGridCoord => ({ col: q, row: 2 * r + q })

export const rdoubledToCube = ({ col, row }: HexGridCoord): Hex => ({ q: (col - row) / 2, r: row })
export const cubeToRdoubled = ({ q, r }: Hex): HexGridCoord => ({ col: 2 * q + r, row: r })

export const hexWrap = (hex: Hex, radius: number): Hex => {
	if (hexLength(hex) <= radius) return hex
	let mirror: Hex = { q: 2 * radius + 1, r: -radius }
	let best = hex
	let bestLen = hexLength(hex)

	for (let i = 0; i < 6; i++) {
		const candidate = hexSubtract(hex, mirror)
		const candidateLen = hexLength(candidate)

		if (candidateLen < bestLen) {
			best = candidate
			bestLen = candidateLen
		}

		mirror = hexRotateRight(mirror)
	}

	return best
}

export const hexAngle = (hex: Hex, orientation: HexOrientation): number => {
	if (hex.q === 0 && hex.r === 0) return 0
	const { x, y } = hexToPixel(hex, { orientation, size: 1 })
	return (Math.atan2(y, x) * (180 / Math.PI) + 360) % 360
}

export const hexDiskBounds = (rings: number, layout: HexLayout, padding = 0) => {
	let maxX = -Infinity
	let maxY = -Infinity
	let minX = Infinity
	let minY = Infinity

	for (const hex of hexRingAt(HEX_ORIGIN, rings))
		for (const { x, y } of hexCorners(hex, layout)) {
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
