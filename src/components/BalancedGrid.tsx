import { cn } from '@/utils'
import type { ComponentProps } from 'react'
import { Children, cloneElement, isValidElement } from 'react'
import { balanceGridItems } from './BalancedGrid.utils'

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
