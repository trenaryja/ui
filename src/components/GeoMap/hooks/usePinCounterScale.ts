'use client'

import { zoomTransform } from 'd3-zoom'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { updatePointTransforms } from '../GeoMap.points.utils'

export type PinCounterScale = {
	/** Attach to the `<g>` wrapping the rendered points/clusters markup. */
	ref: React.RefObject<SVGGElement | null>
	/** Wire into `useGeoZoom`'s `onZoomApplied` — fires synchronously inside d3-zoom's `on('zoom')`. */
	onZoomApplied: (k: number) => void
}

type Args = {
	svgRef: React.RefObject<SVGSVGElement | null>
	/** When true, pins ride the outer zoom group (no counter-scale). */
	scaleWithZoom?: boolean
}

/**
 * Keeps points/clusters at constant pixel size as the user zooms.
 *
 * Two coordinated mechanisms, both required:
 * 1. `onZoomApplied` fires inside d3-zoom's `on('zoom')` so the inverse counter-scale lands in the
 *    same frame as the outer `zoomG` transform — no flicker during live gestures.
 * 2. A dep-less `useLayoutEffect` re-applies the patch on every render, reading live
 *    `zoomTransform(svg).k` (not React state, which lags by a frame). Catches any render path
 *    that replaced `innerHTML` and reset transforms to `scale(1)`.
 *
 * `scaleWithZoom` is read via a ref so toggling it doesn't tear down d3-zoom.
 */
export const usePinCounterScale = ({ svgRef, scaleWithZoom = false }: Args): PinCounterScale => {
	const ref = useRef<SVGGElement>(null)
	const scaleWithZoomRef = useRef(scaleWithZoom)
	useEffect(() => {
		scaleWithZoomRef.current = scaleWithZoom
	}, [scaleWithZoom])

	const onZoomApplied = (k: number) => {
		if (!scaleWithZoomRef.current) updatePointTransforms(ref.current, k)
	}

	useLayoutEffect(() => {
		if (scaleWithZoom || !svgRef.current) return
		updatePointTransforms(ref.current, zoomTransform(svgRef.current).k)
	})

	return { ref, onZoomApplied }
}
