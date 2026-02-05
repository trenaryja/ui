import { directionPlacements, flexPlacements, joinTyped } from '@/utils'
import { useId } from 'react'

export const popoverPositions = joinTyped(directionPlacements, flexPlacements, ' ')
export type PopoverPosition = (typeof popoverPositions)[number]

export type UseNativePopoverOptions = {
	id?: string
	position?: PopoverPosition
	mode?: 'auto' | 'manual'
}

export const useNativePopover = (options?: UseNativePopoverOptions) => {
	const reactId = useId()
	const id = options?.id ?? reactId
	const popoverId = `popover-${id}`
	const anchorName = `--popover-anchor-${id.replace(/:/g, '')}`

	const getPopoverElement = () => (typeof document !== 'undefined' ? document.getElementById(popoverId) : null)

	return {
		triggerProps: {
			popoverTarget: popoverId,
			style: { anchorName } as React.CSSProperties,
		},
		contentProps: {
			popover: options?.mode ?? 'auto',
			id: popoverId,
			style: {
				positionAnchor: anchorName,
				positionArea: options?.position ?? 'bottom center',
			} as React.CSSProperties,
		},
		open: () => getPopoverElement()?.showPopover(),
		close: () => getPopoverElement()?.hidePopover(),
		toggle: () => getPopoverElement()?.togglePopover(),
	}
}
