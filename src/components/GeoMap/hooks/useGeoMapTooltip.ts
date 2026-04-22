'use client'

import { flip, offset, shift, useFloating } from '@floating-ui/react'
import { useEffect, useSyncExternalStore } from 'react'
import type { GeoRegion } from '../GeoMap.types'

type TooltipSnapshot = { featureIdx: number; feature: GeoRegion; value?: number } | null

export type TooltipStore = {
	subscribe: (cb: () => void) => () => void
	getSnapshot: () => TooltipSnapshot
	show: (featureIdx: number, feature: GeoRegion, value?: number) => void
	hide: () => void
	setPoint: (x: number, y: number) => void
	getPoint: () => { x: number; y: number }
	onMove: (cb: (() => void) | null) => void
	setSuppressed: (suppressed: boolean) => void
}

// Hover-state changes don't re-render anything besides the tooltip itself
export const createTooltipStore = (): TooltipStore => {
	let snapshot: TooltipSnapshot = null
	let suppressed = false
	const point = { x: 0, y: 0 }
	let moveCallback: (() => void) | null = null
	const listeners = new Set<() => void>()
	const notify = () => listeners.forEach((l) => l())

	return {
		subscribe: (cb) => {
			listeners.add(cb)
			return () => listeners.delete(cb)
		},
		getSnapshot: () => snapshot,
		show: (featureIdx, feature, value) => {
			if (suppressed) return
			snapshot = { featureIdx, feature, value }
			notify()
		},
		hide: () => {
			if (snapshot === null) return
			snapshot = null
			notify()
		},
		setPoint: (x, y) => {
			point.x = x
			point.y = y
			moveCallback?.()
		},
		getPoint: () => point,
		onMove: (cb) => {
			moveCallback = cb
		},
		setSuppressed: (v) => {
			suppressed = v

			if (v && snapshot !== null) {
				snapshot = null
				notify()
			}
		},
	}
}

export const useTooltipData = (store: TooltipStore) =>
	useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)

export const useFloatingTooltip = (store: TooltipStore, isOpen: boolean) => {
	const { refs, floatingStyles, update } = useFloating({
		open: isOpen,
		placement: 'top',
		middleware: [offset(10), flip(), shift({ padding: 8 })],
	})

	useEffect(() => {
		refs.setPositionReference({
			getBoundingClientRect: () => {
				const { x, y } = store.getPoint()
				return { x, y, width: 0, height: 0, top: y, left: x, right: x, bottom: y }
			},
		})
	}, [refs, store])

	// Pointer moves drive floating-ui directly — bypasses React so we don't re-render on every pixel
	useEffect(() => {
		store.onMove(update)
		return () => store.onMove(null)
	}, [store, update])

	return { floatingRef: refs.setFloating, floatingStyles }
}
