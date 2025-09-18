import { cn } from '@/utils'
import React, { ComponentProps } from 'react'
import { balanceGridItems } from './BalancedGrid.utils'

type BalancedGridProps = ComponentProps<'div'> & {
	maxCols: number
	pack?: boolean
}

export function BalancedGrid({ maxCols, pack, className, style, children }: BalancedGridProps) {
	const childArray = React.Children.toArray(children)
	const { leftoverCount, lastRowIndex, style: balancedGridStyles } = balanceGridItems(childArray, maxCols, pack)

	return (
		<div
			className={cn(
				'grid w-full',
				'grid-cols-[repeat(var(--grid-cols),minmax(0,1fr))]',
				'*:col-span-[var(--grid-normal-span)]',
				'[&_.grid-leftover]:col-span-[var(--grid-last-row-span)]',
				'[&_.grid-first-leftover]:col-start-[var(--grid-last-row-col-start)]!',
				className,
			)}
			style={{ ...style, ...balancedGridStyles }}
		>
			{childArray.map((child, i) => {
				if (!React.isValidElement<{ className?: string }>(child)) return child
				const isLeftover = leftoverCount > 0 && i >= lastRowIndex
				const withClass = cn(child.props.className, {
					'grid-leftover': isLeftover,
					'grid-first-leftover': isLeftover && i === lastRowIndex,
				})
				return React.cloneElement(child, { className: withClass })
			})}
		</div>
	)
}
