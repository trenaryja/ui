import { cn, maybePortal } from '@/utils'
import type { RefObject } from 'react'
import { LuMinus, LuPlus, LuRotateCcw } from 'react-icons/lu'
import { Button } from '../Button/Button'

export const GeoMapZoomControls = ({
	zoomIn,
	zoomOut,
	resetZoom,
	canZoomIn,
	canZoomOut,
	canReset,
	target,
	className,
}: {
	zoomIn: () => void
	zoomOut: () => void
	resetZoom: () => void
	canZoomIn: boolean
	canZoomOut: boolean
	canReset: boolean
	target?: RefObject<HTMLElement | null>
	className?: string
}) =>
	maybePortal(
		<div className={cn('join join-vertical', className)}>
			<Button className='btn-xs join-item' onClick={zoomIn} disabled={!canZoomIn} aria-label='Zoom in'>
				<LuPlus />
			</Button>
			<Button className='btn-xs join-item' onClick={zoomOut} disabled={!canZoomOut} aria-label='Zoom out'>
				<LuMinus />
			</Button>
			<Button className='btn-xs join-item' onClick={resetZoom} disabled={!canReset} aria-label='Reset zoom'>
				<LuRotateCcw className='size-3' />
			</Button>
		</div>,
		target,
	)
