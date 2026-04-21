'use client'

import { useUncontrolled } from '@mantine/hooks'
import type { GeoProjection } from 'd3-geo'
import { select } from 'd3-selection'
import 'd3-transition' // extends Selection with .transition()
import type { ZoomBehavior } from 'd3-zoom'
import { zoom as d3Zoom, zoomIdentity, zoomTransform } from 'd3-zoom'
import { useEffect, useRef, useState } from 'react'
import type { DragBehavior } from '../GeoMap.utils'
import type { GeoZoomState } from '../GeoMap.types'

const MIN_SCALE = 1
const MAX_SCALE = 8
const ZOOM_EQ_TOLERANCE = 1e-6

const isZoomEqual = (a: GeoZoomState | undefined, b: GeoZoomState | undefined) => {
	if (!a || !b) return a === b
	return (
		Math.abs(a.scale - b.scale) < ZOOM_EQ_TOLERANCE &&
		Math.abs(a.center[0] - b.center[0]) < ZOOM_EQ_TOLERANCE &&
		Math.abs(a.center[1] - b.center[1]) < ZOOM_EQ_TOLERANCE
	)
}

type ZoomTransform = { x: number; y: number; k: number }

type ProjectionGeometry = { projection: GeoProjection; viewBoxCenter: [number, number]; dragBehavior: DragBehavior }

/**
 * 'rotate' uses a centered transform (viewport center maps to projection-space (vbCx, vbCy)).
 * 'pan' / 'rotate-lambda' use translate+scale — undo to find the projection-space point under the viewport center.
 */
const computeZoomFromTransform = ({
	transform,
	projection,
	viewBoxCenter,
	dragBehavior,
}: ProjectionGeometry & { transform: ZoomTransform }): GeoZoomState => {
	const [vbCx, vbCy] = viewBoxCenter
	const px = dragBehavior === 'rotate' ? vbCx : (vbCx - transform.x) / transform.k
	const py = dragBehavior === 'rotate' ? vbCy : (vbCy - transform.y) / transform.k
	const inverted = projection.invert?.([px, py]) ?? [0, 0]
	return { scale: transform.k, center: [inverted[0], inverted[1]] }
}

/**
 * Pan: full bidirectional sync via projection.
 * Rotate: scale via transform; center maps to rotation as [-lon, -lat].
 * Rotate-lambda: scale via transform; center.x maps to lambda rotation; center.y is best-effort.
 */
const computeTransformForZoom = ({
	zoomState,
	projection,
	viewBoxCenter,
	dragBehavior,
}: ProjectionGeometry & { zoomState: GeoZoomState }): { transform: ZoomTransform; rotation?: [number, number] } => {
	const { scale, center } = zoomState

	if (dragBehavior === 'pan') {
		const projected = projection([center[0], center[1]]) ?? viewBoxCenter
		return {
			transform: { x: viewBoxCenter[0] - projected[0] * scale, y: viewBoxCenter[1] - projected[1] * scale, k: scale },
		}
	}

	const rotation: [number, number] = dragBehavior === 'rotate' ? [-center[0], -center[1]] : [-center[0], 0]
	return { transform: { x: 0, y: 0, k: scale }, rotation }
}

type UseGeoZoomOpts = {
	svgRef: React.RefObject<SVGSVGElement | null>
	zoomGRef: React.RefObject<SVGGElement | null>
	viewBoxCenter: [number, number]
	zoomEnabled: boolean
	dragEnabled: boolean
	dragBehavior: DragBehavior
	projection: GeoProjection
	projectionScale: number
	rotation?: [number, number]
	zoom?: GeoZoomState
	defaultZoom?: GeoZoomState
	onRotate?: (rotation: [number, number] | undefined) => void
	onZoomChange?: (zoom: GeoZoomState | undefined) => void
	onDragStart?: () => void
	onDragEnd?: () => void
	subPropsZoom?: Record<string, unknown>
}

type ZoomCtx = {
	svg: SVGSVGElement
	zoomG: SVGGElement
	viewBoxCenter: [number, number]
	zoomEnabled: boolean
	dragEnabled: boolean
	dragBehavior: DragBehavior
	behaviorRef: React.RefObject<ZoomBehavior<SVGSVGElement, unknown> | null>
	dragStateRef: React.RefObject<{ startRotation: [number, number]; startPoint: [number, number]; lastY: number } | null>
	rotationRef: React.RefObject<[number, number] | undefined>
	viewBoxSizeRef: React.RefObject<[number, number]>
	projectionScaleRef: React.RefObject<number>
	projectionRef: React.RefObject<GeoProjection>
	deferScale: (k: number) => void
	emitZoom: (z: GeoZoomState) => void
	onRotate?: (rotation: [number, number] | undefined) => void
	onDragStart?: () => void
	onDragEnd?: () => void
	subPropsZoom?: Record<string, unknown>
}

const noDragFilter = (e: Event) => e.type !== 'mousedown' && e.type !== 'touchstart'

const setupPanZoom = ({
	svg,
	zoomG,
	viewBoxSize,
	zoomEnabled,
	dragEnabled,
	onScaleChange,
	onUserZoom,
}: {
	svg: SVGSVGElement
	zoomG: SVGGElement
	viewBoxSize: [number, number]
	zoomEnabled: boolean
	dragEnabled: boolean
	onScaleChange?: (k: number) => void
	onUserZoom?: () => void
}) => {
	const [vw, vh] = viewBoxSize
	const behavior = d3Zoom<SVGSVGElement, unknown>()
		.scaleExtent(zoomEnabled ? [MIN_SCALE, MAX_SCALE] : [1, 1])
		.extent([
			[0, 0],
			[vw, vh],
		])
		.translateExtent([
			[0, 0],
			[vw, vh],
		])
		.on('zoom', (e) => {
			const { x, y, k } = e.transform
			if (k === 1 && x === 0 && y === 0) zoomG.removeAttribute('transform')
			else zoomG.setAttribute('transform', `translate(${x},${y}) scale(${k})`)
			onScaleChange?.(k)
			if (e.sourceEvent) onUserZoom?.()
		})
	if (!dragEnabled) behavior.filter(noDragFilter)
	select(svg).call(behavior)
	return behavior
}

const attachRotateDrag = (ctx: ZoomCtx, lambdaOnly: boolean, onPanY?: (dyMouse: number) => void) => {
	const { svg, dragStateRef, rotationRef, viewBoxSizeRef, projectionScaleRef, onRotate, onDragStart, onDragEnd } = ctx
	const DRAG_THRESHOLD = 3
	let pendingPointerId: number | null = null
	let isDragging = false

	const onPointerDown = (e: PointerEvent) => {
		if (e.button !== 0) return
		pendingPointerId = e.pointerId
		isDragging = false
		dragStateRef.current = {
			startRotation: rotationRef.current ?? [0, 0],
			startPoint: [e.clientX, e.clientY],
			lastY: e.clientY,
		}
	}

	const onPointerMove = (e: PointerEvent) => {
		if (!dragStateRef.current || pendingPointerId == null) return

		if (!isDragging) {
			const dx = e.clientX - dragStateRef.current.startPoint[0]
			const dy = e.clientY - dragStateRef.current.startPoint[1]
			if (dx * dx + dy * dy < DRAG_THRESHOLD * DRAG_THRESHOLD) return
			isDragging = true
			svg.setPointerCapture(pendingPointerId)
			onDragStart?.()
		}

		const { startRotation, startPoint, lastY } = dragStateRef.current
		const dx = e.clientX - startPoint[0]
		const dyDelta = e.clientY - lastY
		dragStateRef.current.lastY = e.clientY

		const rect = svg.getBoundingClientRect()
		const { k } = zoomTransform(svg)
		const svgPerMouse = viewBoxSizeRef.current[0] / rect.width
		const sensitivity = (svgPerMouse * (180 / Math.PI / projectionScaleRef.current)) / k
		const newλ = startRotation[0] + dx * sensitivity

		if (lambdaOnly) {
			onPanY?.(dyDelta)
			onRotate?.([newλ, 0])
		} else {
			const dy = e.clientY - startPoint[1]
			onRotate?.([newλ, Math.max(-90, Math.min(90, startRotation[1] - dy * sensitivity))])
		}
	}

	const onPointerUp = () => {
		const wasDragging = isDragging
		dragStateRef.current = null
		pendingPointerId = null
		isDragging = false
		if (wasDragging) onDragEnd?.()
	}

	svg.addEventListener('pointerdown', onPointerDown)
	svg.addEventListener('pointermove', onPointerMove)
	svg.addEventListener('pointerup', onPointerUp)
	svg.addEventListener('pointercancel', onPointerUp)

	return () => {
		svg.removeEventListener('pointerdown', onPointerDown)
		svg.removeEventListener('pointermove', onPointerMove)
		svg.removeEventListener('pointerup', onPointerUp)
		svg.removeEventListener('pointercancel', onPointerUp)
	}
}

const emitFromCtx = (ctx: ZoomCtx) => () =>
	ctx.emitZoom(
		computeZoomFromTransform({
			transform: zoomTransform(ctx.svg),
			projection: ctx.projectionRef.current,
			viewBoxCenter: ctx.viewBoxCenter,
			dragBehavior: ctx.dragBehavior,
		}),
	)

const setupRotateGlobe = (ctx: ZoomCtx) => {
	const cleanups: (() => void)[] = []
	const [cx, cy] = ctx.viewBoxCenter
	const onUserZoom = emitFromCtx(ctx)

	if (ctx.zoomEnabled) {
		const behavior = d3Zoom<SVGSVGElement, unknown>()
			.scaleExtent([MIN_SCALE, MAX_SCALE])
			.on('zoom', (e) => {
				const { k } = e.transform
				ctx.deferScale(k)
				if (k === 1) ctx.zoomG.removeAttribute('transform')
				else ctx.zoomG.setAttribute('transform', `translate(${cx},${cy}) scale(${k}) translate(${-cx},${-cy})`)
				if (e.sourceEvent) onUserZoom()
			})
			.filter(noDragFilter)
		ctx.behaviorRef.current = behavior
		select(ctx.svg).call(behavior)
	}

	if (ctx.dragEnabled) cleanups.push(attachRotateDrag(ctx, false))
	return cleanups
}

const setupRotateLambda = (ctx: ZoomCtx) => {
	const cleanups: (() => void)[] = []
	const onUserZoom = emitFromCtx(ctx)

	if (ctx.zoomEnabled) {
		ctx.behaviorRef.current = setupPanZoom({
			svg: ctx.svg,
			zoomG: ctx.zoomG,
			viewBoxSize: ctx.viewBoxSizeRef.current,
			zoomEnabled: true,
			dragEnabled: false,
			onScaleChange: ctx.deferScale,
			onUserZoom,
		})
	}

	if (ctx.dragEnabled) {
		cleanups.push(
			attachRotateDrag(ctx, true, (dyMouse) => {
				if (!ctx.behaviorRef.current) return
				const t = zoomTransform(ctx.svg)
				// At scale=1 the map fills the viewport — no room to pan vertically.
				if (t.k === 1) return
				const rect = ctx.svg.getBoundingClientRect()
				const dySvg = dyMouse * (ctx.viewBoxSizeRef.current[0] / rect.width)
				select(ctx.svg).call(ctx.behaviorRef.current.translateBy, 0, dySvg / t.k)
			}),
		)
	}

	return cleanups
}

const setupPan = (ctx: ZoomCtx) => {
	const onUserZoom = emitFromCtx(ctx)
	const behavior = setupPanZoom({
		svg: ctx.svg,
		zoomG: ctx.zoomG,
		viewBoxSize: ctx.viewBoxSizeRef.current,
		zoomEnabled: ctx.zoomEnabled,
		dragEnabled: ctx.dragEnabled,
		onScaleChange: ctx.deferScale,
		onUserZoom,
	})
	behavior.on('start.tooltip', (e) => {
		if (e.sourceEvent && (e.sourceEvent.type === 'mousedown' || e.sourceEvent.type === 'touchstart'))
			ctx.onDragStart?.()
	})
	behavior.on('end.tooltip', (e) => {
		if (e.sourceEvent && (e.sourceEvent.type === 'mouseup' || e.sourceEvent.type === 'touchend')) ctx.onDragEnd?.()
	})

	if (ctx.subPropsZoom) {
		if (ctx.subPropsZoom.scaleExtent) behavior.scaleExtent(ctx.subPropsZoom.scaleExtent as [number, number])
		if (ctx.subPropsZoom.translateExtent)
			behavior.translateExtent(ctx.subPropsZoom.translateExtent as [[number, number], [number, number]])
	}

	ctx.behaviorRef.current = behavior
	return []
}

const SETUP_BY_BEHAVIOR: Record<DragBehavior, (ctx: ZoomCtx) => (() => void)[]> = {
	rotate: setupRotateGlobe,
	'rotate-λ': setupRotateLambda,
	pan: setupPan,
}

// eslint-disable-next-line max-lines-per-function -- orchestrates d3-zoom lifecycle, rAF coalescing, controlled/uncontrolled sync, and three drag strategies
export const useGeoZoom = ({
	svgRef,
	zoomGRef,
	viewBoxCenter,
	zoomEnabled,
	dragEnabled,
	dragBehavior,
	projection,
	projectionScale,
	rotation,
	zoom,
	defaultZoom,
	onRotate,
	onZoomChange,
	onDragStart,
	onDragEnd,
	subPropsZoom,
}: UseGeoZoomOpts) => {
	const behaviorRef = useRef<ZoomBehavior<SVGSVGElement, unknown> | null>(null)
	const dragStateRef = useRef<ZoomCtx['dragStateRef']['current']>(null)
	const lastAppliedRef = useRef<GeoZoomState | undefined>(undefined)
	const initialAppliedRef = useRef(false)
	const pendingEmitRef = useRef<GeoZoomState | undefined>(undefined)
	const pendingScaleRef = useRef<number | null>(null)
	const rafIdRef = useRef<number | null>(null)
	const [scale, setScale] = useState(1)

	const [zoomState, setZoomState] = useUncontrolled<GeoZoomState | undefined>({
		value: zoom,
		defaultValue: defaultZoom,
		finalValue: undefined,
		onChange: onZoomChange,
	})

	const vbSize: [number, number] = [viewBoxCenter[0] * 2, viewBoxCenter[1] * 2]
	const projectionScaleRef = useRef(projectionScale)
	const projectionRef = useRef(projection)
	const viewBoxSizeRef = useRef(vbSize)
	const rotationRef = useRef(rotation)
	projectionScaleRef.current = projectionScale
	projectionRef.current = projection
	viewBoxSizeRef.current = vbSize
	rotationRef.current = rotation

	const scheduleRaf = () => {
		if (rafIdRef.current != null) return
		rafIdRef.current = requestAnimationFrame(() => {
			rafIdRef.current = null
			const t0 = performance.now()
			if (pendingScaleRef.current != null) setScale(pendingScaleRef.current)
			if (pendingEmitRef.current) setZoomState(pendingEmitRef.current)
			pendingScaleRef.current = null
			pendingEmitRef.current = undefined
			const dt = performance.now() - t0
			if (dt > 2) console.log(`[raf setState] ${dt.toFixed(1)}ms`)
		})
	}

	const deferScale = (k: number) => {
		pendingScaleRef.current = k
		scheduleRaf()
	}

	const emitZoom = (z: GeoZoomState) => {
		if (isZoomEqual(z, lastAppliedRef.current)) return
		lastAppliedRef.current = z
		pendingEmitRef.current = z
		scheduleRaf()
	}

	useEffect(() => {
		const svg = svgRef.current
		const zoomG = zoomGRef.current

		if (!svg || !zoomG || (!zoomEnabled && !dragEnabled)) {
			if (behaviorRef.current && svgRef.current) select(svgRef.current).on('.zoom', null)
			behaviorRef.current = null
			zoomG?.removeAttribute('transform')
			return
		}

		const cleanups = SETUP_BY_BEHAVIOR[dragBehavior]({
			svg,
			zoomG,
			viewBoxCenter,
			zoomEnabled,
			dragEnabled,
			dragBehavior,
			behaviorRef,
			dragStateRef,
			rotationRef,
			viewBoxSizeRef,
			projectionScaleRef,
			projectionRef,
			deferScale,
			emitZoom,
			onRotate,
			onDragStart,
			onDragEnd,
			subPropsZoom,
		})

		return () => {
			select(svg).on('.zoom', null)
			for (const fn of cleanups) fn()
			if (rafIdRef.current != null) cancelAnimationFrame(rafIdRef.current)
		}
		// Serialize subPropsZoom so an inline `{...}` literal from the consumer doesn't tear down d3-zoom every render.
		// eslint-disable-next-line react-hooks/exhaustive-deps -- viewBoxCenter, projection, rotation, callbacks read via refs to avoid tearing down on every update
	}, [svgRef, zoomGRef, zoomEnabled, dragEnabled, dragBehavior, subPropsZoom && JSON.stringify(subPropsZoom)])

	useEffect(() => {
		const svg = svgRef.current
		const behavior = behaviorRef.current
		if (!svg || !behavior) return
		// In uncontrolled mode (no `zoom`, after initial), d3-zoom is the source of truth — never apply.
		const target = zoom ?? (initialAppliedRef.current ? undefined : defaultZoom)
		if (!target) return
		if (isZoomEqual(target, lastAppliedRef.current)) return
		initialAppliedRef.current = true
		lastAppliedRef.current = target
		const { transform, rotation: rot } = computeTransformForZoom({
			zoomState: target,
			projection: projectionRef.current,
			viewBoxCenter,
			dragBehavior,
		})
		if (rot) onRotate?.(rot)
		select(svg).call(behavior.transform, zoomIdentity.translate(transform.x, transform.y).scale(transform.k))
		// eslint-disable-next-line react-hooks/exhaustive-deps -- projection/viewBoxCenter/onRotate/defaultZoom read at fire time; re-apply only on controlled value or behavior change
	}, [zoom, dragBehavior])

	const zoomIn = () => {
		if (behaviorRef.current && svgRef.current)
			select(svgRef.current).transition().duration(300).call(behaviorRef.current.scaleBy, 2)
	}

	const zoomOut = () => {
		if (behaviorRef.current && svgRef.current)
			select(svgRef.current).transition().duration(300).call(behaviorRef.current.scaleBy, 0.5)
	}

	const resetZoom = () => {
		if (behaviorRef.current && svgRef.current)
			select(svgRef.current).transition().duration(300).call(behaviorRef.current.transform, zoomIdentity)
		lastAppliedRef.current = undefined
		onRotate?.(undefined)
		setZoomState(undefined)
	}

	return {
		zoomState,
		zoomIn,
		zoomOut,
		resetZoom,
		canZoomIn: scale < MAX_SCALE,
		canZoomOut: scale > MIN_SCALE,
		canReset: scale !== 1,
	}
}
