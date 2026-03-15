'use client'

import { flip, offset, shift, useFloating } from '@floating-ui/react'
import { useEffect, useSyncExternalStore } from 'react'
import type { GeoFeature } from './GeoMap.types'

// ---------------------------------------------------------------------------
// Tooltip store — external store so hover state changes don't re-render the parent
// ---------------------------------------------------------------------------

type TooltipSnapshot = {
	featureIdx: number
	feature: GeoFeature
	value?: number
} | null

export type TooltipStore = {
	subscribe: (cb: () => void) => () => void
	getSnapshot: () => TooltipSnapshot
	show: (featureIdx: number, feature: GeoFeature, value?: number) => void
	hide: () => void
	setPoint: (x: number, y: number) => void
	getPoint: () => { x: number; y: number }
	/** Register a callback that fires on every setPoint — used by floating-ui to reposition */
	onMove: (cb: (() => void) | null) => void
}

export const createTooltipStore = (): TooltipStore => {
	let snapshot: TooltipSnapshot = null
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
	}
}

/** Hook that subscribes to a tooltip store — only components using this hook re-render on hover */
export const useTooltipData = (store: TooltipStore) =>
	useSyncExternalStore(store.subscribe, store.getSnapshot, store.getSnapshot)

// ---------------------------------------------------------------------------
// Floating tooltip positioning
// ---------------------------------------------------------------------------

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

	// Connect mouse moves to floating-ui repositioning — no React re-render needed
	useEffect(() => {
		store.onMove(update)
		return () => store.onMove(null)
	}, [store, update])

	return { floatingRef: refs.setFloating, floatingStyles }
}
