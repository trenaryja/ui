import { lcm } from '../utils'

export const balanceGridItems = <T>(items: T[], maxCols: number, pack?: boolean) => {
	const n = items.length
	if (n <= 1 || maxCols < 2)
		return { leftoverCount: 0, lastRowIndex: n, style: { '--grid-cols': 1 } as React.CSSProperties }

	const candidates = []
	for (let cols = 1; cols <= maxCols; cols++) {
		const rows = Math.ceil(n / cols)
		const emptyCells = rows * cols - n
		candidates.push({ cols, rows, emptyCells })
	}

	const cols = candidates.sort((a, b) => (a.rows !== b.rows ? a.rows - b.rows : a.emptyCells - b.emptyCells))[0]!.cols
	const leftoverCount = n % cols
	const lastRowIndex = n - (leftoverCount === 0 ? cols : leftoverCount)

	let totalCols = cols
	let normalSpan = 1
	let lastRowSpan = 1
	let lastRowColStart = 1

	if (leftoverCount > 0) {
		totalCols = lcm(cols, leftoverCount)
		normalSpan = totalCols / cols

		if (pack) {
			lastRowSpan = normalSpan
			let usedCols = leftoverCount * normalSpan
			let emptyCols = totalCols - usedCols
			let offset = emptyCols / 2

			while (!Number.isInteger(offset)) {
				totalCols *= 2
				normalSpan *= 2
				lastRowSpan *= 2
				usedCols = leftoverCount * normalSpan
				emptyCols = totalCols - usedCols
				offset = emptyCols / 2
			}

			lastRowColStart = offset + 1
		} else {
			lastRowSpan = totalCols / leftoverCount
		}
	}

	return {
		leftoverCount,
		lastRowIndex,
		style: {
			'--grid-cols': totalCols,
			'--grid-normal-span': normalSpan,
			'--grid-last-row-span': lastRowSpan,
			'--grid-last-row-col-start': lastRowColStart,
		} as React.CSSProperties,
	}
}
