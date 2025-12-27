import { cn, lcm } from '@/utils'
import type { ComponentProps, CSSProperties } from 'react'
import { Children, cloneElement, isValidElement } from 'react'

type BalancedGridProps = ComponentProps<'div'> & {
	maxCols: number
	pack?: boolean
}

export const BalancedGrid = ({ maxCols, pack, className, style, children }: BalancedGridProps) => {
	const childArray = Children.toArray(children)
	const { leftoverCount, lastRowIndex, style: balancedGridStyles } = balanceGridItems(childArray, maxCols, pack)

	return (
		<div
			style={{ ...style, ...balancedGridStyles }}
			className={cn(
				'grid w-full',
				'grid-cols-[repeat(var(--grid-cols),minmax(0,1fr))]',
				'*:col-span-(--grid-normal-span)',
				'[&_.grid-leftover]:col-span-(--grid-last-row-span)',
				'[&_.grid-first-leftover]:col-start-(--grid-last-row-col-start)!',
				className,
			)}
		>
			{childArray.map((child, i) => {
				if (!isValidElement<{ className?: string }>(child)) return child
				const isLeftover = leftoverCount > 0 && i >= lastRowIndex
				const withClass = cn(child.props.className, {
					'grid-leftover': isLeftover,
					'grid-first-leftover': isLeftover && i === lastRowIndex,
				})
				return cloneElement(child, { className: withClass })
			})}
		</div>
	)
}

function balanceGridItems<T>(items: T[], maxCols: number, pack?: boolean) {
	const n = items.length
	if (n <= 1 || maxCols < 2) return { leftoverCount: 0, lastRowIndex: n, style: { '--grid-cols': 1 } as CSSProperties }

	const candidates = []
	for (let cols = 1; cols <= maxCols; cols++) {
		const rows = Math.ceil(n / cols)
		const emptyCells = rows * cols - n
		candidates.push({ cols, rows, emptyCells })
	}

	const [{ cols }] = candidates.sort((a, b) => (a.rows !== b.rows ? a.rows - b.rows : a.emptyCells - b.emptyCells))
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
		} as CSSProperties,
	}
}
