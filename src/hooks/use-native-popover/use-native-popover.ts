import { css, directionPlacements, flexPlacements, joinTyped } from '@/utils'
import { useId } from 'react'

export const popoverPositions = [...joinTyped(directionPlacements, flexPlacements, ' '), 'center'] as const
export type PopoverPosition = (typeof popoverPositions)[number]

const toPositionStyles = (position: PopoverPosition) => {
	if (position === 'center') return { positionArea: 'center' }
	const [direction, alignment] = position.split(' ')
	const isVertical = direction === 'top' || direction === 'bottom'

	if (alignment === 'center')
		return {
			positionArea: direction,
			...(isVertical ? { justifySelf: 'anchor-center' } : { alignSelf: 'anchor-center' }),
		}

	if (isVertical)
		return {
			positionArea: `${direction} ${alignment === 'start' ? 'span-right' : 'span-left'}`,
			justifySelf: alignment === 'start' ? 'start' : 'end',
		}

	return {
		positionArea: `${direction} ${alignment === 'start' ? 'span-bottom' : 'span-top'}`,
		alignSelf: alignment === 'start' ? 'start' : 'end',
	}
}

export type UseNativePopoverOptions = {
	id?: string
	position?: PopoverPosition
	mode?: 'auto' | 'hint' | 'manual'
	action?: 'hide' | 'show' | 'toggle'
	positionTryFallbacks?: string
	positionTryOrder?: 'most-block-size' | 'most-height' | 'most-inline-size' | 'most-width' | 'normal'
	positionVisibility?: 'always' | 'anchors-visible' | 'no-overflow'
}

export const useNativePopover = (options?: UseNativePopoverOptions) => {
	const {
		mode = 'auto',
		action = 'toggle',
		position = 'bottom center',
		positionTryFallbacks = 'flip-block, flip-inline',
		positionTryOrder,
		positionVisibility = 'anchors-visible',
	} = options ?? {}

	const reactId = useId()
	const id = options?.id ?? reactId
	const popoverId = `popover-${id}`
	const anchorName = `--popover-anchor-${id.replace(/:/g, '')}`
	const getPopoverElement = () => (typeof document !== 'undefined' ? document.getElementById(popoverId) : null)

	return {
		triggerProps: {
			popoverTarget: popoverId,
			...(action !== 'toggle' && { popoverTargetAction: action }),
			style: { anchorName },
		},
		contentProps: {
			popover: mode,
			id: popoverId,
			style: css({
				positionAnchor: anchorName,
				...toPositionStyles(position),
				positionTryFallbacks,
				positionTryOrder,
				positionVisibility,
			}),
		},
		open: () => getPopoverElement()?.showPopover(),
		close: () => getPopoverElement()?.hidePopover(),
		toggle: () => getPopoverElement()?.togglePopover(),
	}
}
